import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { INotificationsRepository } from '../../domain/repositories/INotificationsRepository'
import { Notification } from '../../domain/models/Notification'
import { NotificationPayload } from '../transformers/NotificationPayload'

export class NotificationsRepository extends ApiRepository implements INotificationsRepository {
  private readonly notificationsResourceName: string = 'notifications'

  public async getAllNotificationsByUser(
    inAppNotificationFormat?: boolean,
    onlyUnread?: boolean,
    limit?: number,
    offset?: number
  ): Promise<Notification[]> {
    const queryParams = new URLSearchParams()
    if (inAppNotificationFormat) {
      queryParams.set('inAppNotificationFormat', 'true')
    }
    if (onlyUnread) {
      queryParams.set('onlyUnread', 'true')
    }
    if (typeof limit === 'number') {
      queryParams.set('limit', limit.toString())
    }
    if (typeof offset === 'number') {
      queryParams.set('offset', offset.toString())
    }
    return this.doGet(
      this.buildApiEndpoint(this.notificationsResourceName, 'all'),
      true,
      queryParams.toString().length > 0 ? queryParams : undefined
    )
      .then((response) => {
        const notifications = response.data.data.notifications
        return notifications.map((notification: NotificationPayload) => {
          const { dataverseDisplayName, dataverseAlias, ...restNotification } = notification
          return {
            ...restNotification,
            ...(dataverseDisplayName && { collectionDisplayName: dataverseDisplayName }),
            ...(dataverseAlias && { collectionAlias: dataverseAlias })
          }
        }) as Notification[]
      })
      .catch((error) => {
        throw error
      })
  }

  public async deleteNotification(notificationId: number): Promise<void> {
    return this.doDelete(
      this.buildApiEndpoint(this.notificationsResourceName, notificationId.toString())
    )
      .then(() => undefined)
      .catch((error) => {
        throw error
      })
  }

  public async getUnreadNotificationsCount(): Promise<number> {
    return this.doGet(
      this.buildApiEndpoint(this.notificationsResourceName, 'unreadCount'),
      true
    ).then((response) => response.data.data.unreadCount as number)
  }

  public async markNotificationAsRead(notificationId: number): Promise<void> {
    return this.doPut(
      this.buildApiEndpoint(this.notificationsResourceName, 'markAsRead', notificationId),
      {}
    ).then(() => undefined)
  }
}
