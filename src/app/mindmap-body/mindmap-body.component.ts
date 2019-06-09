import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation} from '@angular/core';
// import {init} from './mapjs/mapjs-util'
import {init} from './mapjs/start'
import {defaultColor, foreGround, level1Color, lightForeGround} from './mapjs/theme';
import * as tinyColor from 'tinycolor2';
import {BehaviorSubject} from "rxjs";

type MindmapManipulation = {
  eventName: string,
  event?: any,
  id: number,
  parentId?: number,
}

export type PrepareMindmapEvent = {
  action: string,
  path: [string],
  args?: any,
}

function getIdFromPath(path) {
  return ['r', ...path].join('_');
}

@Component({
  selector: 'app-mindmap-body',
  templateUrl: './mindmap-body.component.html',
  styleUrls: ['./mindmap-body.component.css', './mapjs/mapjs-default-styles.css'],
  encapsulation: ViewEncapsulation.None,
})

export class MindmapBodyComponent implements AfterViewInit {

  @ViewChild('container') container;
  private mapModel;
  private selectedNodeId: number;
  private rootIds: number[];

  @Output() manipulation: EventEmitter<MindmapManipulation> = new EventEmitter<MindmapManipulation>();
  @Output() prepare = new EventEmitter<PrepareMindmapEvent>();

  @Input() set map(v) {
    if (v)
      this._map.next(v)
  };

  private _map = new BehaviorSubject<{ ideas: any }>(null);

  private modelInitResolve: Function;
  private modelInitPromise = new Promise(resolve => this.modelInitResolve = resolve);

  constructor() {
  }

  ngAfterViewInit(): void {
    setTimeout(async () => {
      this._map.subscribe(v => {
        if (v) this.init(v)
      })
    })
  }

  private init(_map) {
    this.rootIds = Object.keys(_map.ideas).map(k => _map.ideas[k].id);
    console.log('initting new map');
    this.mapModel = init(this.container.nativeElement, _map);
    this.modelInitResolve();
    this.addManipulationListeners();
    this.addSelectionListener();
    this.addPrepareListener();
    console.log(this.mapModel.getIdea())
  }

  private addPrepareListener() {
    this.mapModel.addEventListener('prepare', e => {
      console.log('received prepare event', e);
      let args;
      switch (e.action) {
        case 'delete':
          args = {oldName: e.idea.title};
          break;
        case 'rename':
          args = {oldName: e.idea.title, newName: e.title}
      }
      this.prepare.emit({
        action: e.action,
        path: e.id === 'r' ? [] : e.id.slice(2).split('_'),
        args,
      })
    })
  }

  private addSelectionListener() {
    this.mapModel.addEventListener('nodeSelectionChanged', e => {
      if (this.selectedNodeId != e) {
        this.selectedNodeId = e;
        this.emitSelectionChanged();
      }
    });
    this.selectedNodeId = this.mapModel.getSelectedNodeId();
    this.emitSelectionChanged();
  }

  private addManipulationListeners() {
    const events = ['nodeCreated', 'nodeRemoved', 'nodeTitleChanged',
      'colorChanged', 'foreGroundChanged', 'parentNodeChanged'];
    events.forEach(eventName => {
      this.mapModel.addEventListener(eventName, e => {
        this.manipulation.emit({
          eventName,
          event: e,
          id: e.id,
          // parentId: this.mapModel.getIdea().findParent(e.id).id
        })
      })
    });
  }

  private emitSelectionChanged() {
    this.manipulation.emit({
      eventName: 'nodeSelectionChanged',
      id: this.selectedNodeId,
    })
  }

  addSubIdea(path) {
    const parent = path.slice(0, -1);
    let parentPath = getIdFromPath(parent);
    this.mapModel.addSubIdea('standard', parentPath, null, `${parentPath}_${path.slice(-1)[0]}`);
  }

  addSiblingIdeaBefore() {
    this.mapModel.addSiblingIdeaBefore();
  }

  removeSubIdea(path) {
    this.mapModel.removeSubIdea('standard', [getIdFromPath(path)])
  }

  updateIdeaTitle(path, newTitle) {
    this.mapModel.updateTitle(getIdFromPath(path), newTitle, false, 'standard')
  }

  setIdeaColor(color, foreGround?) {
    this.mapModel.updateStyle('angular', foreGround ? 'color' : 'background', color)
  }

  get selectedColor() {
    return this.mapModel.getSelectedStyle('background') ||
      (this.rootIds.includes(this.selectedNodeId) ? level1Color : defaultColor)
  }

  get selectedForeGround() {
    return this.mapModel.getSelectedStyle('color') ||
      (tinyColor(this.selectedColor).isDark() ? lightForeGround : foreGround)
  }

  @Input() set editingEnabled(value: boolean) {
    this.modelInitPromise.then(() =>
      this.mapModel.setEditingEnabled(value))
  }

  undo() {
    this.mapModel.undo()
  }

  redo() {
    this.mapModel.redo()
  }

  get canUndo() {
    return this.mapModel && this.mapModel.getIdea().canUndo()
  }

  get canRedo() {
    return this.mapModel && this.mapModel.getIdea().canRedo()
  }

  get isRootSelected() {
    return this.rootIds && this.rootIds.includes(this.selectedNodeId)
  }
}
