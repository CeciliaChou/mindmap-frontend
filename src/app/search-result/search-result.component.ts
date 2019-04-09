import {Component, OnDestroy, OnInit} from '@angular/core';
import {MindmapMeta, MindmapService} from "../mindmap.service";
import {Observable, Subscription} from "rxjs";
import {map} from "rxjs/operators";
import {ActivatedRoute, Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit, OnDestroy {

  items = [];
  itemsSubscription: Subscription;

  get loadingMore() {
    return this.mindmap.isCurrentSearchLoading
  }

  get currentSearchResult(): Observable<MindmapMeta[]> {
    return this.mindmap.currentSearchResults$
      .pipe(map(
        ({items}) => {
          return items;
        }
      ))
  }

  get currentSearchHasMoreItems(): Observable<boolean> {
    return this.mindmap.currentSearchResults$
      .pipe(map(({nextCursor}) => !!nextCursor))
  }

  constructor(
    private mindmap: MindmapService,
    private route: ActivatedRoute,
    private router: Router,
    private message: NzMessageService,
  ) {
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(paramMap => {
      console.log('query params update', paramMap.get('q'));
      setTimeout(() => this.mindmap.currentSearchText = paramMap.get('q'))
    });
    this.itemsSubscription = this.currentSearchResult.subscribe(
      items => {
        this.items.splice(0, this.items.length, ...items);
      }
    )
  }

  ngOnDestroy(): void {
    this.itemsSubscription.unsubscribe()
  }

  loadMoreItems() {
    this.mindmap.searchWithCurrentText()
  }

  goToMindmap(id) {
    setTimeout(() => this.router.navigateByUrl(`/mindmap/${id}`))
  }

  applyToCollaborate(id) {
    this.mindmap.applyToCollaborateIn(id)
      .subscribe(() => this.message.success('The application has been submitted'))
  }

  isMyMindmap(id) {
    return this.mindmap.isMyMindmap(id)
  }

}
