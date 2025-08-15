import { NotificationsRepository } from './infra/repositories/NotificationsRepository'
import { GetAllNotificationsByUser } from './domain/useCases/GetAllNotificationsByUser'
import { DeleteNotification } from './domain/useCases/DeleteNotification'

const notificationsRepository = new NotificationsRepository()

const getAllNotificationsByUser = new GetAllNotificationsByUser(notificationsRepository)
const deleteNotification = new DeleteNotification(notificationsRepository)

export { getAllNotificationsByUser, deleteNotification }

export { Notification, NotificationType, RoleAssignment } from './domain/models/Notification'
