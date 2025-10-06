import { Notification } from '../models/Notification'

export interface INotificationsRepository {
  getAllNotificationsByUser(
    inAppNotificationFormat?: boolean,
    onlyUnread?: boolean,
    limit?: number,
    offset?: number
  ): Promise<Notification[]>
  deleteNotification(notificationId: number): Promise<void>
  getUnreadNotificationsCount(): Promise<number>
  markNotificationAsRead(notificationId: number): Promise<void>
}
