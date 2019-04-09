import {Injectable} from '@angular/core';
import {Apollo} from "apollo-angular";
import {HttpLink} from "apollo-angular-link-http";
import {WebSocketLink} from "apollo-link-ws";
import {environment} from "../environments/environment";
import {split} from 'apollo-link';
import {getMainDefinition} from 'apollo-utilities';
import {InMemoryCache, IntrospectionFragmentMatcher} from "apollo-cache-inmemory";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {last, map, tap} from "rxjs/operators";
import {setContext} from 'apollo-link-context';
import {
  ApplyToCollaborateGQL,
  AttachGQL,
  CollaborateInMindmapGQL,
  CreateMindmapGQL,
  DeleteGQL,
  MyMindmapsGQL,
  RenameGQL,
  Role,
  SearchForMindmapsGQL,
  SubscribeToMindmapGQL,
} from "../generated/graphql";
import {NotificationService} from "./notification.service";
import {ItemCache} from "./item-cache";
import {UserService} from "./user.service";
import {HttpHeaders} from "@angular/common/http";

type SourceMindmap = {
  name: string,
  nodes: { [p: string]: SourceMindmap }
}

export type MindmapEvent = any;
export type MindmapMeta = {
  id?: string,
  name?: string,
  owner?: {
    id?: string,
  }
}

type MindmapConnection = {
  items?: MindmapMeta[],
  nextCursor?: string,
}

@Injectable({
  providedIn: 'root'
})
export class MindmapService {
  private myMindmapsOwner$ = new Subject<MindmapMeta[]>();
  private myMindmapsCollaborator$ = new Subject<MindmapMeta[]>();
  private myMindmapsOwner: MindmapMeta[] = [];
  private myMindmapsCollaborator: MindmapMeta[] = [];

  private myMindmapsCache = new ItemCache();

  private myMindmapsLoaded = new BehaviorSubject({owner: false, collaborator: false});

  private _currentMindmap$ = new BehaviorSubject<MindmapMeta>(null);

  get currentMindmap$(): Observable<MindmapMeta> {
    return this._currentMindmap$;
  }

  private _isCurrentSearchLoading = false;
  get isCurrentSearchLoading(): boolean {
    return this._isCurrentSearchLoading;
  }

  private _currentSearchText = '';

  get currentSearchText(): string {
    return this._currentSearchText;
  }

  set currentSearchText(text: string) {
    if (text !== this._currentSearchText) {
      this._currentSearchText = text;
      this.restoreCurrentSearchResults();
      if (text)
        this.searchWithCurrentText()
    }
  }

  private _currentSearchResults$ = new BehaviorSubject<MindmapConnection>({
    items: [],
    nextCursor: null,
  });

  get currentSearchResults$(): Observable<MindmapConnection> {
    return this._currentSearchResults$;
  }

  constructor(
    private apollo: Apollo,
    private httpLink: HttpLink,
    private attachGQL: AttachGQL,
    private deleteGQL: DeleteGQL,
    private renameGQL: RenameGQL,
    private subscribeToMindmapGQL: SubscribeToMindmapGQL,
    private createMindmapGQL: CreateMindmapGQL,
    private myMindmapsGQL: MyMindmapsGQL,
    private searchForMindmapsGQL: SearchForMindmapsGQL,
    private addCollaboratorGQL: CollaborateInMindmapGQL,
    private applyToCollaborateGQL: ApplyToCollaborateGQL,
    private notificationService: NotificationService,
    private userService: UserService,
  ) {
    this.userService.currentUserLoaded$
      .subscribe(() => {
        // Create an http link:
        const http = httpLink.create({
          uri: environment.gqlEndpoint,
          headers: new HttpHeaders({Authorization: `Bearer ${this.userService.token}`}),
        });

        // Create a WebSocket link:
        const ws = new WebSocketLink({
          uri: environment.gqlEndpointWs,
          options: {
            reconnect: true,
            connectionParams: {
              authToken: this.userService.token
            }
          }
        });

        // using the ability to split links, you can send data to each link
        // depending on what kind of operation is being sent
        const link = split(
          // split based on operation type
          ({query}) => {
            const {kind, operation} = getMainDefinition(query);
            return kind === 'OperationDefinition' && operation === 'subscription';
          },
          ws,
          http,
        );

        // Pass in the union type introspection data to avoid heuristic fragment matcher warning
        const introspectionQueryResultData = {
          "__schema": {
            "types": [
              {
                "kind": "UNION",
                "name": "MindmapEvent",
                "possibleTypes": [
                  {
                    "name": "Doc"
                  },
                  {
                    "name": "Modification"
                  },
                  {
                    name: 'MindmapLabelEvent'
                  }
                ]
              },
            ]
          }
        };

        apollo.create({
          link,
          cache: new InMemoryCache({
            fragmentMatcher: new IntrospectionFragmentMatcher({
              introspectionQueryResultData
            })
          }),
        });
      })
  }

  transform(source: SourceMindmap, id = 'r', root = true) {
    const result = {
      id,
      title: source.name,
    };
    if (Object.keys(source.nodes).length !== 0)
      result['ideas'] = Object.keys(source.nodes).reduce((acc, cur, idx) => {
        acc[(idx / 2 + 1) * (idx % 2 === 0 ? 1 : -1)] = this.transform(source.nodes[cur], `${id}_${cur}`, false);
        return acc
      }, {});
    if (root) return {
      id: 'root',
      formatVersion: 3,
      ideas: {1: result}
    };
    else return result;
  }

  subscribe(mindmapId: string): Observable<MindmapEvent> {
    return this.subscribeToMindmapGQL.subscribe({
      id: mindmapId
    }).pipe(map(v => {
      const {data: {subscribe}} = v;
      let root;
      if (subscribe.__typename === 'Doc') root = JSON.parse(subscribe.json);
      return {root, ...subscribe}
    }))
  }

  attach(mindmapId: string, path: [string]): Observable<any> {
    return this.attachGQL.mutate({id: mindmapId, path})
  }

  delete(mindmapId: string, path: [string], args: { oldName: string }): Observable<any> {
    return this.deleteGQL.mutate({id: mindmapId, path, oldName: args.oldName})
  }

  rename(mindmapId: string, path: [string], args: { oldName, newName }): Observable<any> {
    const {oldName, newName} = args;
    return this.renameGQL.mutate({id: mindmapId, path, oldName, newName})
  }

  private addToMyMindmaps(role: Role, ...items: MindmapMeta[]) {
    let list, ob;
    switch (role) {
      case Role.Owner:
        [list, ob] = [this.myMindmapsOwner, this.myMindmapsOwner$];
        break;
      case Role.Collaborator:
        [list, ob] = [this.myMindmapsCollaborator, this.myMindmapsCollaborator$]
    }
    list.push(...items);
    this.myMindmapsCache.addToSet(...items);
    ob.next(list);
  }

  isMyMindmap(id) {
    return this.myMindmapsCache.isIdInSet(id)
  }

  createMindmap(name: string) {
    return this.createMindmapGQL.mutate({name})
      .pipe(tap(v => {
        console.log('mutation result is', v);
        const {data: {createMindmap: {id}}} = v;
        this.addToMyMindmaps(Role.Owner, {id, name})
      }), map(({data: {createMindmap}}) => createMindmap))
  }

  private setMindmapsLoaded(role) {
    if (!this.myMindmapsLoaded.isStopped) {
      const value = this.myMindmapsLoaded.value;
      if (!value[role]) {
        value[role] = true;
        this.myMindmapsLoaded.next(value)
      }
      if ([Role.Owner, Role.Collaborator].every(r => value[r.toString().toLowerCase()]))
        this.myMindmapsLoaded.complete()
    }
  }

  private fetchMyMindmaps(role: Role, cursor: string) {
    this.myMindmapsGQL.fetch({role: [role], cursor})
      .subscribe(({
                    data: {
                      me:
                        {mindmaps: {items, nextCursor}}
                    }
                  }) => {
        this.addToMyMindmaps(role, ...items);
        switch (role) {
          case Role.Owner:
            this.setMindmapsLoaded('owner');
            break;
          case Role.Collaborator:
            this.setMindmapsLoaded('collaborator')
        }
        if (nextCursor)
          this.fetchMyMindmaps(role, nextCursor)
      });

    // Subscribe for being added as collaborator
    this.notificationService.subscribeToNew()
      .subscribe(({meta}) => {
        if (meta && meta.startsWith('addCollaborator')) {
          const [_, mindmapId, name] = meta.split('/');
          // Due to unknown reason, apollo subscription is fired multiple times with same payload
          // This check is to circumvent the problem
          if (this.myMindmapsCollaborator.splice(-1)[0].id !== mindmapId)
            this.addToMyMindmaps(Role.Collaborator, {
              id: mindmapId,
              name
            });
        }
      })
  }

  getMyMindmaps(): { owner: Observable<MindmapMeta[]>, collaborator: Observable<MindmapMeta[]> } {
    [Role.Owner, Role.Collaborator].forEach(role => this.fetchMyMindmaps(role, null));
    return {owner: this.myMindmapsOwner$, collaborator: this.myMindmapsCollaborator$}
  }

  async setCurrentMindmap(id) {
    if (id !== (this._currentMindmap$.value && this._currentMindmap$.value.id)) {
      // Wait for my mindmaps to be loaded
      if (!this.myMindmapsLoaded.isStopped) await this.myMindmapsLoaded.pipe(last()).toPromise();
      // Then get the correct mindmap
      const mindmap = this.myMindmapsCache.getItem(id);
      if (!mindmap) throw 'Not authorized';
      this._currentMindmap$.next({id, name: mindmap.name})
    }
  }

  private searchForMindmaps(text, cursor): Observable<MindmapConnection> {
    return this.searchForMindmapsGQL.fetch({text, cursor})
      .pipe(map(({data: {searchMindmaps}}) => searchMindmaps))
  }

  searchWithCurrentText() {
    console.log('fetching with', this._currentSearchText);
    this._isCurrentSearchLoading = true;
    let currentValue = this._currentSearchResults$.value;
    this.searchForMindmaps(this._currentSearchText, currentValue.nextCursor)
      .subscribe(({items, nextCursor}) => {
        currentValue.items.push(...items);
        currentValue.nextCursor = nextCursor;
        this._currentSearchResults$.next(currentValue);
        console.log('search results:', currentValue);
        this._isCurrentSearchLoading = false;
      })
  }

  restoreCurrentSearchResults() {
    this._currentSearchResults$.next({
      items: [],
      nextCursor: null,
    })
  }

  applyToCollaborateIn(mindmapId): Observable<void> {
    return this.applyToCollaborateGQL.mutate({mindmapId})
  }

  addCollaborator(mindmapId, userId): Observable<void> {
    return this.addCollaboratorGQL.mutate({mindmapId, userId})
  }

  clear() {
    this.myMindmapsCache.clearItems();
    this.myMindmapsOwner = [];
    this.myMindmapsOwner$.next([]);
    this.myMindmapsCollaborator = [];
    this.myMindmapsCollaborator$.next([])
  }

}
