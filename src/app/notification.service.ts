import {Injectable} from '@angular/core';
import {
  MarkNotificationAsReadGQL,
  GetAllNotificationsGQL,
  NewNotificationGQL
} from "../generated/graphql";
import {BehaviorSubject, Observable} from "rxjs";
import {map, tap} from "rxjs/operators";
import {Router} from "@angular/router";
import {MindmapService} from "./mindmap.service";
import {ItemCache} from "./item-cache";

type Notification = {
  id?: string,
  content?: string,
  isRead?: boolean,
  meta?: string,
}

type NotificationConnection = {
  items?: Notification[],
  nextCursor?: string,
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private _notificationsList$ = new BehaviorSubject<Notification[]>([]);

  get notificationsList$(): Observable<Notification[]> {
    return this._notificationsList$;
  }

  unreadCount = 0;

  private notificationCache = new ItemCache();

  constructor(
    private newNotificationGQL: NewNotificationGQL,
    private getAllGQL: GetAllNotificationsGQL,
    private markAsReadGQL: MarkNotificationAsReadGQL,
  ) {
  }

  subscribeToNew(): Observable<Notification> {
    return this.newNotificationGQL.subscribe()
      .pipe(map(({data: {newNotification}}) => newNotification),
        tap(notification => {
          if (!this.notificationCache.isIdInSet(notification.id)) {
            this.notificationCache.addToSet(notification);
            this.unreadCount++;
            const notifications = this._notificationsList$.value;
            notifications.splice(0, 0, notification);
            this._notificationsList$.next(notifications);
          }
        }))
  }

  getAll(cursor: string = null) {
    const currentList = this._notificationsList$.value;
    return this.getAllGQL.fetch({cursor, unreadFilter: false})
      .pipe(map(({data: {listNotifications}}) => listNotifications))
      .subscribe(({items, nextCursor}) => {
        currentList.push(...items);
        this.notificationCache.addToSet(...items);
        this.unreadCount += items.filter(({isRead}) => !isRead).length;
        this._notificationsList$.next(currentList);
        if (nextCursor) this.getAll(nextCursor)
      })
  }

  clearUnreadCount() {
    this.unreadCount = 0
  }

  markAsRead(id?: string) {
    return this.markAsReadGQL.mutate({id})
      .subscribe(() => {
        console.log('marked as read for', id);
        if (id) {
          this.notificationCache.getItem(id).isRead = true;
          this.unreadCount--;
        } else {
          // Do not modify unreadCount on batch operation
          this._notificationsList$.value.forEach(item => item.isRead = true)
        }
      })
  }

  clear() {
    this.notificationCache.clearItems();
    this._notificationsList$.next([])
  }

}
