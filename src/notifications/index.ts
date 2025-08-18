import { NotificationsRepository } from './infra/repositories/NotificationsRepository'
import { GetAllNotificationsByUser } from './domain/useCases/GetAllNotificationsByUser'
import { DeleteNotification } from './domain/useCases/DeleteNotification'
import { GetUnreadCount } from './domain/useCases/GetUnreadCount'
import { MarkAsRead } from './domain/useCases/MarkAsRead'

const notificationsRepository = new NotificationsRepository()

const getAllNotificationsByUser = new GetAllNotificationsByUser(notificationsRepository)
const deleteNotification = new DeleteNotification(notificationsRepository)
const getUnreadCount = new GetUnreadCount(notificationsRepository)
const markAsRead = new MarkAsRead(notificationsRepository)

export { getAllNotificationsByUser, deleteNotification, getUnreadCount, markAsRead }

export { Notification, NotificationType, RoleAssignment } from './domain/models/Notification'
