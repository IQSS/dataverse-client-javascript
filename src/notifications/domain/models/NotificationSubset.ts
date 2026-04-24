import { Notification } from './Notification'

export interface NotificationSubset {
  notifications: Notification[]
  totalNotificationCount: number
}
