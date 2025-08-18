import { UseCase } from '../../../core/domain/useCases/UseCase'
import { INotificationsRepository } from '../repositories/INotificationsRepository'

export class GetUnreadCount implements UseCase<number> {
  private notificationsRepository: INotificationsRepository

  constructor(notificationsRepository: INotificationsRepository) {
    this.notificationsRepository = notificationsRepository
  }

  async execute(): Promise<number> {
    return await this.notificationsRepository.getUnreadCount()
  }
}
