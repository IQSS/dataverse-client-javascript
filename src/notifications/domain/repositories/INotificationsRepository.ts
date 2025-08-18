import { Notification } from '../models/Notification'

export interface INotificationsRepository {
  getAllNotificationsByUser(inAppNotificationFormat?: boolean): Promise<Notification[]>
  deleteNotification(notificationId: number): Promise<void>
  getUnreadCount(): Promise<number>
  markAsRead(notificationId: number): Promise<void>
}
