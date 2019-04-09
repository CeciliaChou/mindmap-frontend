import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Label, LabelService} from "../label.service";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.scss']
})
export class LabelsComponent {

  @Input() labels: Label[] = [];

  inputVisible = false;
  inputValue = '';
  @ViewChild('inputElement') inputElement: ElementRef;

  @Input() clickToSubscribe = true;

  @Output() newLabelCreated = new EventEmitter<string>();
  @Output() labelRemoved = new EventEmitter<Label>();
  @Output() labelClicked = new EventEmitter<Label>();

  constructor(
    private labelsService: LabelService,
    private nzMessage: NzMessageService,
  ) { }

  isLabelSubscribed(label) {
    return this.labelsService.isLabelSubscribed(label.id)
  }

  isLabelDisplayed(labelId) {
    let currentDisplayedLabel = this.labelsService.currentDisplayedLabel;
    return currentDisplayedLabel && currentDisplayedLabel.id === labelId
  }

  toggleSubscribeTo(label) {
    if (this.clickToSubscribe) {
      const isUnsubscribe = this.isLabelSubscribed(label);
      this.labelsService.toggleSubscribeTo(label.id)
        .subscribe(() => {
          this.nzMessage.success(
            `Successfully ${isUnsubscribe ? 'unsubscribed' : 'subscribed'} to label ${label.name}`)
        })
    } else {
      this.labelClicked.emit(label)
    }
  }

  showInput(): void {
    this.inputVisible = true;
    setTimeout(() => {
      this.inputElement.nativeElement.focus();
    }, 10);
  }

  handleClose(removed: Label, e): void {
    e.preventDefault();
    e.stopPropagation();
    this.labelRemoved.emit(removed);
  }

  handleInputConfirm(): void {
    if (this.inputValue) {
      this.newLabelCreated.emit(this.inputValue)
    }
    this.inputValue = '';
    this.inputVisible = false;
  }

}
