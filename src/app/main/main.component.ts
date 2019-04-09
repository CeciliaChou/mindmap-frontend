import {Component, OnInit} from '@angular/core';
import {MindmapService} from "../mindmap.service";
import {UserService} from "../user.service";
import {MindmapHolderComponent} from "../mindmap-holder/mindmap-holder.component";
import {LabelService} from "../label.service";
import {SearchResultComponent} from "../search-result/search-result.component";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  private isCollapsed = false;
  mindmapName: string = '';
  breadcrumbType: 'search' | 'mindmap' | 'subscribed';

  get searchText() {
    return this.mindmap.currentSearchText
  }

  get currentLabelName() {
    let currentDisplayedLabel = this.labelService.currentDisplayedLabel;
    return currentDisplayedLabel && currentDisplayedLabel.name
  }

  constructor(private mindmap: MindmapService,
              private userService: UserService,
              private labelService: LabelService) {
  }

  ngOnInit(): void {
    this.mindmap.currentMindmap$.subscribe(item => {
      this.mindmapName = item && item.name || ''
    });
    this.userService.getToken();
    this.userService.currentUserLoaded$
      .subscribe(() => {
        this.labelService.clear();
        this.labelService.getSubscribedLabels();
      })
  }

  routerActivate(component) {
    if (component instanceof MindmapHolderComponent)
      this.breadcrumbType = 'mindmap';
    else if (component instanceof SearchResultComponent)
      this.breadcrumbType = 'search';
    else
      this.breadcrumbType = "subscribed";
  }
}
