import {Component, OnInit} from '@angular/core';
import {Label, LabelService} from "../label.service";
import {Idea, Question} from "../../generated/graphql";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../user.service";
import {NzMessageService} from "ng-zorro-antd";
import {ItemCache} from "../item-cache";

@Component({
  selector: 'app-label-detail',
  templateUrl: './label-detail.component.html',
  styleUrls: ['./label-detail.component.scss']
})
export class LabelDetailComponent implements OnInit {

  label: Label;
  questions: Question[] = [];
  questionCursor: string;
  questionLoading = false;
  ideas: Idea[] = [];
  ideaCursor: string;
  ideaLoading = false;

  addQuestionLoading = false;
  addIdeaLoading = false;

  itemSelected: false | 'question' | 'idea' = false;
  addressingItems: Question[] | Idea[] = [];
  addressingItemsCache = new ItemCache();
  addressingCursor: string;
  addressingLoading = false;

  private _selectedQuestion: Question;
  private _selectedIdea: Idea;
  get selectedIdea(): Idea {
    return this._selectedIdea;
  }

  set selectedIdea(value: Idea) {
    this._selectedIdea = value;
    if (this._selectedQuestion)
      this._selectedQuestion = null;
    this.selectItem("idea")
  }
  get selectedQuestion(): Question {
    return this._selectedQuestion;
  }

  set selectedQuestion(value: Question) {
    this._selectedQuestion = value;
    if (this._selectedIdea)
      this._selectedIdea = null;
    this.selectItem("question")
  }

  get selectedItem() {
    return this.selectedIdea || this.selectedQuestion
  }


  get isLabelSubscribed() {
    return this.label && this.labelService.isLabelSubscribed(this.label.id)
  }

  constructor(
    private labelService: LabelService,
    private userService: UserService,
    private route: ActivatedRoute,
    private nzMessage: NzMessageService,
  ) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(p => {
      this.labelService.getLabel(p.get('labelId'))
        .subscribe(l => {
          console.log('got label', l);
          this.label = l;
          this.questions = [];
          this.ideas = [];
          [this.questionCursor, this.ideaCursor] = [null, null];
          this.labelService.currentDisplayedLabel = l;
          this.loadMore("question");
          this.loadMore("idea")
        })
    })
  }

  shouldDisplayInclude(type) {
    return itemId => this.itemSelected && this.itemSelected !== type &&
      !this.addressingItemsCache.isIdInSet(itemId)
  }

  selectItem(type: 'question' | 'idea') {
    this.addressingItemsCache.clearItems();
    this.addressingItems = [];
    this.itemSelected = type;
    this.loadMoreAddressing();
  }

  loadMore(type: 'question' | 'idea') {
    if (type === "question") this.questionLoading = true;
    else this.ideaLoading = true;
    (type === "question" ? this.labelService.getLabelQuestions : this.labelService.getLabelIdeas)
      .call(this.labelService, this.label.id, type === "question" ? this.questionCursor : this.ideaCursor)
      .subscribe(({items, nextCursor}) => {
        console.log('got entities', type, items);
        if (type === "question") {
          this.questions = this.questions.concat(items);
          this.questionCursor = nextCursor;
          this.questionLoading = false
        } else {
          this.ideas = this.ideas.concat(items);
          this.ideaCursor = nextCursor;
          this.ideaLoading = false
        }
      })
  }

  loadMoreAddressing() {
    let ob;
    if (this.itemSelected === "question") {
      ob = this.labelService.getQuestionIdeas(this.selectedItem.id, this.addressingCursor)
    } else {
      ob = this.labelService.getIdeaQuestions(this.selectedItem.id, this.addressingCursor)
    }
    this.addressingLoading = true;
    ob.subscribe(({items, nextCursor}) => {
      this.addressingCursor = nextCursor;
      // @ts-ignore
      this.addressingItems = this.addressingItems.concat(items);
      this.addressingItemsCache.addToSet(...items);
      this.addressingLoading = false
    })
  }

  toggleSubscribe() {
    const isUnsubscribe = this.isLabelSubscribed;
    this.labelService.toggleSubscribeTo(this.label.id)
      .subscribe(() => {
        this.nzMessage.success(
          `Successfully ${isUnsubscribe ? 'unsubscribed' : 'subscribed'} to label ${this.label.name}`)
      })
  }

  addEntity(type: 'question' | 'idea', description: string, title?: string) {
    if (type === "question") {
      this.addQuestionLoading = true;
    } else {
      this.addIdeaLoading = true;
    }
    this.labelService.createEntityWithLabel(type, {title, description}, this.label.id)
      .subscribe(data => {
        console.log('added data is', data);
        if (type === "question") {
          this.questions = this.questions.concat([data]);
          this.addQuestionLoading = false
        } else {
          this.ideas = this.ideas.concat([data]);
          this.addIdeaLoading = false
        }
      })
  }

  addressQuestion(item) {
    const ob = this.itemSelected === "question" ?
      this.labelService.addressQuestion(this.selectedItem.id, item.id) :
      this.labelService.addressQuestion(item.id, this.selectedItem.id);
    ob.subscribe(() => {
      // @ts-ignore
      this.addressingItems = this.addressingItems.concat([item]);
      this.addressingItemsCache.addToSet(item);
    })
  }

}
