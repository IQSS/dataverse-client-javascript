import { Notification } from '../models/Notification'

export interface INotificationsRepository {
  getAllNotificationsByUser(): Promise<Notification[]>
  deleteNotification(notificationId: number): Promise<void>
}
