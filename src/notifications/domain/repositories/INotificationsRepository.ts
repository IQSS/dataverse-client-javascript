import { Notification } from '../models/Notification'

export interface INotificationsRepository {
  getAllNotificationsByUser(inAppNotificationFormat?: boolean): Promise<Notification[]>
  deleteNotification(notificationId: number): Promise<void>
}
