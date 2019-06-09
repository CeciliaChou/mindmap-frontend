import {Component, ElementRef, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzDropdownContextComponent, NzDropdownService, NzModalService} from 'ng-zorro-antd';
import {Observable, Subject} from 'rxjs';
import {MindmapMeta, MindmapService} from "../mindmap.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../user.service";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {
  @Input() isCollapsed: boolean;
  @ViewChild('listRenameInput') private listRenameInput: ElementRef;
  @ViewChild('itemInput') private listInput: ElementRef;

  currentItemUuid: string;
  contextListUuid: string;
  addItemModalVisible = false;
  addItemOkLoading = false;
  renameListModalVisible = false;

  isSubscribedOn = false; // todo

  private dropdown: NzDropdownContextComponent;
  private destroy$ = new Subject();

  private list$: { owner: Observable<MindmapMeta[]>, collaborator: Observable<MindmapMeta[]> };

  constructor(
    private dropdownService: NzDropdownService,
    private modal: NzModalService,
    private mindmap: MindmapService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(v => console.log('paramMap', v));
    this.userService.currentUserLoaded$.subscribe(() => {
      this.mindmap.clear();
      this.list$ = this.mindmap.getMyMindmaps();
    });
    this.mindmap.currentMindmap$.subscribe(item => {
      this.currentItemUuid = item && item.id;
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  closeAddItemModal(): void {
    this.addItemModalVisible = false;
  }

  closeRenameListModal(): void {
    this.renameListModalVisible = false;
  }

  openAddListModal(): void {
    this.addItemModalVisible = true;
    setTimeout(() => {
      this.listInput.nativeElement.focus();
    });
  }

  openRenameListModal(): void {
    this.renameListModalVisible = true;
    setTimeout(() => {
      // const title = this.lists.find(l => l._id === this.contextListUuid).title;
      // this.listRenameInput.nativeElement.value = title;
      this.listRenameInput.nativeElement.focus();
    });
  }

  contextMenu($event: MouseEvent, template: TemplateRef<void>, uuid: string): void {
    this.dropdown = this.dropdownService.create($event, template);
    this.contextListUuid = uuid;
  }

  goToSubscribed() {
    this.router.navigateByUrl('/subscribed')
  }

  rename(title: string): void {

    this.closeRenameListModal();
  }

  add(name: string): void {
    this.addItemOkLoading = true;
    this.mindmap.createMindmap(name)
      .subscribe(({id}) => {
        this.addItemOkLoading = false;
        this.closeAddItemModal();
        this.setCurrentItem(id)
      })
  }

  setCurrentItem(id) {
    this.router.navigateByUrl(`/mindmap/${id}`)
  }

  delete(): void {
    const uuid = this.contextListUuid;
    this.modal.confirm({
      nzTitle: '确认删除列表',
      nzContent: '该操作会导致该列表下的所有待办事项被删除',
      nzOnOk: () =>
        new Promise((res, rej) => {

          res();
        }).catch(() => console.error('Delete list failed'))
    });
  }

  close(): void {
    this.dropdown.close();
  }
}
