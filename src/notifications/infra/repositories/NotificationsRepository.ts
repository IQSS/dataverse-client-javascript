import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { INotificationsRepository } from '../../domain/repositories/INotificationsRepository'
import { Notification } from '../../domain/models/Notification'

export class NotificationsRepository extends ApiRepository implements INotificationsRepository {
  private readonly notificationsResourceName: string = 'notifications'

  public async getAllNotificationsByUser(): Promise<Notification[]> {
    return this.doGet(this.buildApiEndpoint(this.notificationsResourceName, 'all'), true)
      .then((response) => response.data.data.notifications as Notification[])
      .catch((error) => {
        throw error
      })
  }

  public async deleteNotificationByUser(notificationId: number): Promise<void> {
    return this.doDelete(
      this.buildApiEndpoint(this.notificationsResourceName, notificationId.toString())
    )
      .then(() => {})
      .catch((error) => {
        throw error
      })
  }
}
