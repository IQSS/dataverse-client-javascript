import { UseCase } from '../../../core/domain/useCases/UseCase'
import { INotificationsRepository } from '../repositories/INotificationsRepository'

export class GetUnreadNotificationsCount implements UseCase<number> {
  private notificationsRepository: INotificationsRepository

  constructor(notificationsRepository: INotificationsRepository) {
    this.notificationsRepository = notificationsRepository
  }

  /**
   * Use case for retrieving the number of unread notifications for the current user.
   *
   * @returns {Promise<number>} - A promise that resolves to the number of unread notifications.
   */
  async execute(): Promise<number> {
    return await this.notificationsRepository.getUnreadNotificationsCount()
  }
}
