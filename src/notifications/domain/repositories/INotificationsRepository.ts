import { NotificationSubset } from '../models/NotificationSubset'

export interface INotificationsRepository {
  getAllNotificationsByUser(
    inAppNotificationFormat?: boolean,
    onlyUnread?: boolean,
    limit?: number,
    offset?: number
  ): Promise<NotificationSubset>
  deleteNotification(notificationId: number): Promise<void>
  getUnreadNotificationsCount(): Promise<number>
  markNotificationAsRead(notificationId: number): Promise<void>
}
