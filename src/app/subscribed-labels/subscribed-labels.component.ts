import { Component, OnInit } from '@angular/core';
import {LabelService} from "../label.service";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-subscribed-labels',
  templateUrl: './subscribed-labels.component.html',
  styleUrls: ['./subscribed-labels.component.scss']
})
export class SubscribedLabelsComponent implements OnInit {

  get subscribedLabels() {
    return this.labelService.subscribedLabels
  }

  constructor(
    private labelService: LabelService,
    private router: Router,
    private nzMessage: NzMessageService,
  ) { }

  ngOnInit() {
  }

  toggleSubscribe(labelId) {
    const isUnsubscribe = this.labelService.isLabelSubscribed(labelId);
    this.labelService.toggleSubscribeTo(labelId)
      .subscribe(() => {
        this.nzMessage.success(
          `Successfully ${isUnsubscribe ? 'unsubscribed' : 'subscribed'} to label`)
      })
  }

  showLabelDetail(labelId) {
    this.router.navigateByUrl(`/subscribed/${labelId}`)
  }

}
