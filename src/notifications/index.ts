import { NotificationsRepository } from './infra/repositories/NotificationsRepository'
import { GetAllNotificationsByUser } from './domain/useCases/GetAllNotificationsByUser'
import { DeleteNotificationByUser } from './domain/useCases/DeleteNotificationByUser'

const notificationsRepository = new NotificationsRepository()

const getAllNotificationsByUser = new GetAllNotificationsByUser(notificationsRepository)
const deleteNotificationByUser = new DeleteNotificationByUser(notificationsRepository)

export { getAllNotificationsByUser, deleteNotificationByUser }

export { Notification } from './domain/models/Notification'
