import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {from, merge, Observable, Subscription} from "rxjs";
import {MindmapEvent, MindmapService} from "../mindmap.service";
import {PrepareMindmapEvent} from "../mindmap-body/mindmap-body.component";
import {buffer, filter, map, skipUntil, switchMap, take, tap} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";
import {Label, LabelService} from "../label.service";
import {LabelAction} from "../../generated/graphql";
import {NzModalService} from "ng-zorro-antd";

@Component({
  selector: 'app-mindmap-holder',
  templateUrl: './mindmap-holder.component.html',
  styleUrls: ['./mindmap-holder.component.scss']
})
export class MindmapHolderComponent implements OnInit, AfterViewInit, OnDestroy {
  mindmapEvents$: Observable<MindmapEvent>;
  map$;
  modification$: Observable<MindmapEvent>;

  labelSubscription: Subscription;

  selectedPath: string[];

  @ViewChild('body') body;

  labels: Label[] = [];

  private viewInitPromise = new Promise(resolve => this.viewInitResolve = resolve);
  private viewInitResolve;

  private _mindmapId;
  get mindmapId() {
    return this._mindmapId;
  }

  set mindmapId(value) {
    console.log('set mindmapId to', value);
    this._mindmapId = value;
    this.init(value);
  }

  constructor(
    private mindmap: MindmapService,
    private route: ActivatedRoute,
    private labelService: LabelService,
    private nzModal: NzModalService,
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(p => {
      const mindmapId = p.get('mapId');
      console.log('detected route change, params', p);
      this.viewInitPromise
        .then(() => this.mindmap.setCurrentMindmap(mindmapId))
        .then(() => this.mindmapId = mindmapId)
        .catch(() => this.mindmapId = null);
    })
  }

  ngOnDestroy(): void {
    if (this.labelSubscription)
      this.labelSubscription.unsubscribe()
  }

  private init(mindmapId) {
    this.mindmapEvents$ = this.mindmap.subscribe(mindmapId);
    this.map$ =
      this.mindmapEvents$.pipe(
        filter(v => v.type === 'Doc'),
        take(1),
        map(v => this.mindmap.transform(v.root)),
        tap(doc => console.log('doc is', doc)));

    const modificationsOb = this.mindmapEvents$.pipe(
      filter(v => v.type === 'Modification'));
    this.modification$ = merge(
      // This is to ensure that all Modifications come AFTER the Doc is emitted
      modificationsOb.pipe(
        buffer(this.map$), switchMap(v => from(v))),
      modificationsOb.pipe(
        skipUntil(this.map$)));

    this.modification$.subscribe(m => {
      console.log('received modification', m);
      switch (m.action) {
        case 'ATTACH':
          this.body.addSubIdea(m.path);
          break;
        case "DELETE":
          this.body.removeSubIdea(m.path);
          break;
        case "RENAME":
          this.body.updateIdeaTitle(m.path, m.value)
      }
    })
  }

  getLabels(path) {
    this.labels = [];
    if (this.labelSubscription) this.labelSubscription.unsubscribe();

    const getLabelsOb = this.labelService.getNodeLabels(this._mindmapId, path);
    getLabelsOb.subscribe(labels => {
      this.selectedPath = path;
      this.labels = labels;
    });

    const labelEventsOb = this.mindmapEvents$
      .pipe(filter(v => v.type === 'MindmapLabelEvent'
        && v.path.join('_') === path.join('_')));

    this.labelSubscription = merge(
      labelEventsOb.pipe(buffer(getLabelsOb), switchMap(v => from(v))),
      labelEventsOb.pipe(skipUntil(getLabelsOb))
    ).subscribe(v => {
      console.log('received labelAction', v);
      setTimeout(() => {
        switch (v.labelAction) {
          case LabelAction.Associate:
            this.labels.push(v.labelValue);
            break;
          case LabelAction.Disassociate:
            const idx = this.labels.findIndex(l => l.id === v.labelValue.id);
            if (idx !== -1) this.labels.splice(idx, 1)
        }
      })
    })
  }

  onManipulation(e) {
    if (e.eventName === 'nodeSelectionChanged') {
      const path = e.id === 'r' ? [] : e.id.slice(2).split('_');
      this.getLabels(path)
    }
  }

  prepare(e: PrepareMindmapEvent) {
    console.log('prepare', e);
    this.mindmap[e.action](this._mindmapId, e.path, e.args).subscribe(() => {
    })
  }

  handleClose(removed: Label): void {
    this.nzModal.confirm({
      nzTitle: 'Are you sure you want to remove this label?',
      nzOnOk: () => this.labelService.disassociateNodeWithLabel(
        this._mindmapId, this.selectedPath, removed.id).toPromise()
    })
  }

  handleInputConfirm(value): void {
    this.labelService.associateNodeWithLabel(
      this._mindmapId, this.selectedPath, value)
      .subscribe(() => {
      })
  }

  ngAfterViewInit(): void {
    this.viewInitResolve()
  }
}
