import { Notification } from '../models/Notification'

export interface INotificationsRepository {
  getAllNotificationsByUser(): Promise<Notification[]>
  deleteNotificationByUser(notificationId: number): Promise<void>
}
