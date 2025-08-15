import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { INotificationsRepository } from '../../domain/repositories/INotificationsRepository'
import { Notification } from '../../domain/models/Notification'

export class NotificationsRepository extends ApiRepository implements INotificationsRepository {
  private readonly notificationsResourceName: string = 'notifications'

  public async getAllNotificationsByUser(
    inAppNotificationFormat?: boolean
  ): Promise<Notification[]> {
    const queryParams = inAppNotificationFormat ? { inAppNotificationFormat: 'true' } : undefined
    return this.doGet(
      this.buildApiEndpoint(this.notificationsResourceName, 'all'),
      true,
      queryParams
    )
      .then((response) => response.data.data.notifications as Notification[])
      .catch((error) => {
        throw error
      })
  }

  public async deleteNotification(notificationId: number): Promise<void> {
    return this.doDelete(
      this.buildApiEndpoint(this.notificationsResourceName, notificationId.toString())
    )
      .then(() => {})
      .catch((error) => {
        throw error
      })
  }
}
