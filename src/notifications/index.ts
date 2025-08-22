import { NotificationsRepository } from './infra/repositories/NotificationsRepository'
import { GetAllNotificationsByUser } from './domain/useCases/GetAllNotificationsByUser'
import { DeleteNotification } from './domain/useCases/DeleteNotification'
import { GetUnreadNotificationsCount } from './domain/useCases/GetUnreadNotificationsCount'
import { MarkNotificationAsRead } from './domain/useCases/MarkNotificationAsRead'

const notificationsRepository = new NotificationsRepository()

const getAllNotificationsByUser = new GetAllNotificationsByUser(notificationsRepository)
const deleteNotification = new DeleteNotification(notificationsRepository)
const getUnreadNotificationsCount = new GetUnreadNotificationsCount(notificationsRepository)
const markNotificationAsRead = new MarkNotificationAsRead(notificationsRepository)

export {
  getAllNotificationsByUser,
  deleteNotification,
  getUnreadNotificationsCount,
  markNotificationAsRead
}

export { Notification, NotificationType, RoleAssignment } from './domain/models/Notification'
