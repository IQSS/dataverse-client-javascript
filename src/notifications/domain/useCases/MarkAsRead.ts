import { UseCase } from '../../../core/domain/useCases/UseCase'
import { INotificationsRepository } from '../repositories/INotificationsRepository'

export class MarkAsRead implements UseCase<void> {
  private notificationsRepository: INotificationsRepository

  constructor(notificationsRepository: INotificationsRepository) {
    this.notificationsRepository = notificationsRepository
  }

  async execute(notificationId: number): Promise<void> {
    return await this.notificationsRepository.markAsRead(notificationId)
  }
}
