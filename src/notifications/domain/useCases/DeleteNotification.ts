import { UseCase } from '../../../core/domain/useCases/UseCase'
import { INotificationsRepository } from '../repositories/INotificationsRepository'

/**
 * Use case for deleting a specific notification for the current user.
 *
 * @param notificationId - The ID of the notification to delete.
 * @returns {Promise<void>} - A promise that resolves when the notification is deleted.
 */
export class DeleteNotification implements UseCase<void> {
  constructor(private readonly notificationsRepository: INotificationsRepository) {}

  async execute(notificationId: number): Promise<void> {
    return this.notificationsRepository.deleteNotification(notificationId)
  }
}
