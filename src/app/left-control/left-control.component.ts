import {Component, OnInit, Input, ViewChild, OnDestroy, TemplateRef} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {ListComponent} from '../list/list.component';
import {Observable, Subject, Subscription} from "rxjs";
import {MindmapMeta, MindmapService} from "../mindmap.service";
import {debounceTime, filter, map} from "rxjs/operators";
import {UserService} from "../user.service";
import {NzMessageService, NzModalService, NzNotificationService} from "ng-zorro-antd";
import {NotificationService} from "../notification.service";
import {el} from "@angular/platform-browser/testing/src/browser_util";

const DEBOUNCE_TIME = 400;

@Component({
  selector: 'app-left-control',
  templateUrl: './left-control.component.html',
  styleUrls: ['./left-control.component.less']
})
export class LeftControlComponent implements OnInit, OnDestroy {
  @Input() isCollapsed: boolean;
  @ViewChild(ListComponent) listComponent: ListComponent;

  userSearchInput: string;
  private searchUserInput$ = new Subject<string>();
  private notificationSubscription: Subscription;

  @ViewChild('newNotification') notificationTemplate: TemplateRef<{}>;

  // When search page is on, the autocomplete component is hidden
  isSearchPageOn: boolean;

  private _notificationBoxVisible = false;

  get notificationBoxVisible(): boolean {
    return this._notificationBoxVisible;
  }

  set notificationBoxVisible(open) {
    if (open) {
      this.notificationService.clearUnreadCount();
      this.nzNotification.remove()
    } else
      this.notificationService.markAsRead();
    this._notificationBoxVisible = open
  }

  get loadingSearchItems() {
    return this.mindmap.isCurrentSearchLoading
  }

  get currentSearchResultItems(): Observable<MindmapMeta[]> {
    return this.mindmap.currentSearchResults$
      .pipe(map(({items}) => items))
  }

  get currentSearchHasMoreItems(): Observable<boolean> {
    return this.mindmap.currentSearchResults$
      .pipe(map(({nextCursor}) => !!nextCursor))
  }

  get searchText(): string {
    return this.mindmap.currentSearchText
  }

  get currentUser() {
    return this.userService.currentUser
  }

  get unreadCount() {
    return this.notificationService.unreadCount
  }

  get notifications$() {
    return this.notificationService.notificationsList$
  }

  constructor(
    private router: Router,
    private mindmap: MindmapService,
    private userService: UserService,
    private modal: NzModalService,
    private message: NzMessageService,
    private notificationService: NotificationService,
    private nzNotification: NzNotificationService,
  ) {
  }

  ngOnInit() {
    this.searchUserInput$.pipe(debounceTime(DEBOUNCE_TIME))
      .subscribe(text => {
        this.mindmap.currentSearchText = text;
        if (this.isSearchPageOn)
          this.goToSearch()
      });

    // Subscribe for whether the search page is on
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(v => {
        const after = (<NavigationEnd>v).url.startsWith('/search');
        if (this.isSearchPageOn && !after &&
          this.mindmap.currentSearchText !== this.userSearchInput)
          this.mindmap.currentSearchText = this.userSearchInput;
        this.isSearchPageOn = after
      });

    this.userService.currentUserLoaded$
      .subscribe(() => {
        this.notificationService.clear();
        this.notificationService.getAll();
        this.notificationSubscription = this.notificationService.subscribeToNew()
          .subscribe(notification => {
            this.nzNotification.template(this.notificationTemplate, {
              nzData: notification,
              nzDuration: 0,
              nzKey: notification.id,
            }).onClose.subscribe(() => {
              this.notificationService.markAsRead(notification.id)
            })
          });
      })
  }

  ngOnDestroy(): void {
    this.searchUserInput$.complete();
    this.notificationSubscription.unsubscribe()
  }

  goToSearch() {
    this.router.navigate(['/search'], {
      queryParams: {q: this.mindmap.currentSearchText}
    })
  }

  openAddListModal(): void {
    this.listComponent.openAddListModal();
  }

  goSetting() {
    this.router.navigateByUrl('/setting');
  }

  searchInput(value: string) {
    this.searchUserInput$.next(value)
  }

  clickSearchItem(id, owner) {
    setTimeout(() => {
      if (this.mindmap.isMyMindmap(id)) {
        this.router.navigateByUrl(`/mindmap/${id}`)
      } else {
        this.modal.confirm({
          nzTitle: `This mindmap belongs to ${owner.id}`,
          nzContent: 'Do you wish to collaborate in it?',
          nzOnOk: () => this.mindmap.applyToCollaborateIn(id).toPromise()
            .then(() => this.message.success('The application has been submitted')),
        })
      }
    })
  }

  notificationClick(target, id) {
    this.anchorClick(target);
    this.nzNotification.remove(id)
  }

  notificationBoxClick(target) {
    this.anchorClick(target);
    this._notificationBoxVisible = false
  }

  anchorClick(target: string) {
    // This is to avoid the 'change after check' error of breadcrumb
    setTimeout(() => {
      const [action, ...args] = target.split('/');
      switch (action) {
        case 'mindmap':
          this.router.navigateByUrl(`/mindmap/${args[0]}`);
          break;
        case 'addCollaborator':
          this.mindmap.addCollaborator(args[0], args[1]).subscribe(() => {
          })
      }
    });
  }
}
