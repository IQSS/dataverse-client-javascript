import { UseCase } from '../../../core/domain/useCases/UseCase'
import { INotificationsRepository } from '../repositories/INotificationsRepository'

export class MarkNotificationAsRead implements UseCase<void> {
  private notificationsRepository: INotificationsRepository

  constructor(notificationsRepository: INotificationsRepository) {
    this.notificationsRepository = notificationsRepository
  }

  /**
   * Use case for marking a notification as read.
   *
   * @param notificationId - The ID of the notification to mark as read.
   * @returns {Promise<void>} - A promise that resolves when the notification is marked as read.
   */
  async execute(notificationId: number): Promise<void> {
    return await this.notificationsRepository.markNotificationAsRead(notificationId)
  }
}
