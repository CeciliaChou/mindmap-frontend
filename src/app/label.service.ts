import {Injectable} from '@angular/core';
import {
  AddressQuestionGQL,
  AssociateEntityWithLabelGQL,
  AssociateNodeWithLabelGQL,
  CreateIdeaGQL, CreateLabelGQL,
  CreateQuestionGQL,
  DisassociateNodeWithLabelGQL,
  EntityType,
  GetIdeaQuestionsGQL, GetLabelByNameGQL,
  GetLabelGQL,
  GetLabelIdeasGQL,
  GetLabelQuestionsGQL,
  GetNodeLabelsGQL,
  GetQuestionIdeasGQL,
  GetSubscribedLabelsGQL,
  SubscribeToLabelGQL,
  UnsubscribeToLabelGQL,
} from "../generated/graphql";
import {Observable, of, Subject} from "rxjs";
import {map, switchMap, tap} from "rxjs/operators";
import {ItemCache} from "./item-cache";
import {UserService} from "./user.service";

export type Label = {
  id?: string,
  name?: string,
}

@Injectable({
  providedIn: 'root'
})
export class LabelService {

  subscribedLabels: Label[] = [];
  private subscribedLabelsCache = new ItemCache();
  private subscribedLabelsLoaded = new Subject();

  currentDisplayedLabel: Label;

  constructor(
    private userService: UserService,
    private getLabelGQL: GetLabelGQL,
    private getNodeLabelsGQL: GetNodeLabelsGQL,
    private associateNodeWithLabelGQL: AssociateNodeWithLabelGQL,
    private disassociateNodeWithLabelGQL: DisassociateNodeWithLabelGQL,
    private getSubscribedLabelsGQL: GetSubscribedLabelsGQL,
    private subscribeToLabelGQL: SubscribeToLabelGQL,
    private unsubscribeToLabelGQL: UnsubscribeToLabelGQL,
    private getLabelIdeasGQL: GetLabelIdeasGQL,
    private getLabelQuestionsGQL: GetLabelQuestionsGQL,
    private getQuestionIdeasGQL: GetQuestionIdeasGQL,
    private getIdeaQuestionsGQL: GetIdeaQuestionsGQL,
    private createQuestionGQL: CreateQuestionGQL,
    private createIdeaGQL: CreateIdeaGQL,
    private associateEntityWithLabelGQL: AssociateEntityWithLabelGQL,
    private addressQuestionGQL: AddressQuestionGQL,
    private getLabelByNameGQL: GetLabelByNameGQL,
    private createLabelGQL: CreateLabelGQL,
  ) {
  }

  getLabel(labelId): Observable<Label> {
    let cachedItem = this.subscribedLabelsCache.getItem(labelId);
    if (cachedItem) return of(cachedItem);
    const ob = this.getLabelGQL.fetch({labelId}).pipe(map(({data: {getLabel}}) => getLabel));
    console.log('isStopped', this.subscribedLabelsLoaded.isStopped);
    return this.subscribedLabelsLoaded.isStopped ? ob : this.subscribedLabelsLoaded.pipe(switchMap(() => ob))
  }

  getNodeLabels(mindmapId, path): Observable<Label[]> {
    return this.getNodeLabelsGQL.fetch({mindmapId, path})
      .pipe(map(({data: {getNodeLabels}}) => getNodeLabels))
  }

  associateNodeWithLabel(mindmapId, path, labelId): Observable<void> {
    return this.associateNodeWithLabelGQL.mutate({mindmapId, path, labelId})
  }

  disassociateNodeWithLabel(mindmapId, path, labelId): Observable<void> {
    return this.disassociateNodeWithLabelGQL.mutate({mindmapId, path, labelId})
  }

  getSubscribedLabels() {
    this.getSubscribedLabelsGQL.fetch()
      .subscribe(({data: {getSubscribedLabels}}) => {
        this.subscribedLabelsCache.addToSet(...getSubscribedLabels);
        this.subscribedLabels.splice(0, this.subscribedLabels.length, ...getSubscribedLabels);
        if (!this.subscribedLabelsLoaded.isStopped) {
          this.subscribedLabelsLoaded.next();
          this.subscribedLabelsLoaded.complete()
        }
      })
  }

  isLabelSubscribed(labelId) {
    return this.subscribedLabelsCache.isIdInSet(labelId)
  }

  toggleSubscribeTo(labelId): Observable<void> {
    return this.getLabel(labelId)
      .pipe(switchMap(label => {
        const isUnsubscribe = this.isLabelSubscribed(labelId);
        return (isUnsubscribe ? this.unsubscribeToLabelGQL : this.subscribeToLabelGQL)
          .mutate({labelId})
          .pipe(tap(() => {
            if (isUnsubscribe) {
              this.subscribedLabelsCache.removeItem(labelId);
              this.subscribedLabels.splice(
                this.subscribedLabels.findIndex(({id}) => id === labelId), 1)
            } else {
              this.subscribedLabelsCache.addToSet(label);
              this.subscribedLabels.push(label)
            }
          }))
      }))
  }

  getLabelQuestions(labelId, cursor) {
    return this.getLabelQuestionsGQL.fetch({labelId, cursor})
      .pipe(map(({data: {getLabel: {questions}}}) => questions))
  }

  getLabelIdeas(labelId, cursor) {
    return this.getLabelIdeasGQL.fetch({labelId, cursor})
      .pipe(map(({data: {getLabel: {ideas}}}) => ideas))
  }

  getQuestionIdeas(questionId, cursor) {
    return this.getQuestionIdeasGQL.fetch({questionId, cursor})
      .pipe(map(({data: {getQuestion: {addressedBy}}}) => addressedBy))
  }

  getIdeaQuestions(ideaId, cursor) {
    return this.getIdeaQuestionsGQL.fetch({ideaId, cursor})
      .pipe(map(({data: {getIdea: {addresses}}}) => addresses))
  }

  createEntity(type: 'question' | 'idea', args: { title: string, description: string }) {
    if (type === "question")
      return this.createQuestionGQL.mutate(args);
    else
      return this.createIdeaGQL.mutate(args)
  }

  associateEntityWithLabel(type: 'question' | 'idea', entityId: string, labelId: string) {
    return this.associateEntityWithLabelGQL.mutate({
      labelId, entityId,
      entityType: type === "question" ? EntityType.Question : EntityType.Idea
    })
  }

  createEntityWithLabel(type: 'question' | 'idea', args: { title: string, description: string }, labelId: string) {
    return this.createEntity(type, args)
      .pipe(switchMap(result => {
        const data = type === "question" ? result.data.createQuestion : result.data.createIdea;
        return this.associateEntityWithLabel(type, data.id, labelId).pipe(map(() => data))
      }))
  }

  addressQuestion(questionId: string, ideaId: string) {
    return this.addressQuestionGQL.mutate({questionId, ideaId})
  }

  getOrCreateLabel(name: string): Observable<string> {
    return this.getLabelByNameGQL.fetch({name}, {fetchPolicy: 'network-only'})
      .pipe(switchMap(({data: {getLabelByName}}) => {
        if (getLabelByName) return of(getLabelByName.id);
        return this.createLabelGQL.mutate({name})
          .pipe(map(({data: {createLabel: {id}}}) => id))
      }))
  }

  clear() {
    this.subscribedLabelsCache.clearItems();
    this.subscribedLabels.splice(0, this.subscribedLabels.length)
  }

}
