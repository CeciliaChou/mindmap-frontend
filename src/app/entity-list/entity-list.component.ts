import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-entity-list',
  templateUrl: './entity-list.component.html',
  styleUrls: ['./entity-list.component.scss']
})
export class EntityListComponent implements OnInit {

  @Input() entityType: 'question' | 'idea';
  @Input() dataSource: any[];
  @Input() header: string;
  @Input() hasMoreItems: boolean;
  @Input() addItemEnabled: boolean = true;
  @Input() itemLoading: boolean;
  @Input() addItemLoading: boolean;
  @Input() canSelectItem: boolean = true;

  @Input() shouldDisplayInclude: (string) => boolean = () => false;
  @Input() includeText: string;

  @Output() loadMore = new EventEmitter();
  @Output() addItem = new EventEmitter();
  @Output() includeItem = new EventEmitter<any>();

  addEntityModalVisible = false;

  private _selectedItem: any;
  get selectedItem(): any {
    return this._selectedItem;
  }
  @Input() set selectedItem(value: any) {
    if (this.canSelectItem) {
      this._selectedItem = value;
    }
  }

  @Output() selectedItemChange = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  addEntity(description, title?) {
    if (this.addItemEnabled)
      this.addItem.emit({description, title})
  }

  select(item) {
    if (this.canSelectItem) {
      this.selectedItem = item;
      this.selectedItemChange.emit(item)
    }
  }

  loadMoreItems() {
    this.loadMore.emit()
  }

  includeItemClicked(e, item) {
    e.preventDefault();
    e.stopPropagation();
    this.includeItem.emit(item)
  }

}
