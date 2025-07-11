import { UseCase } from '../../../core/domain/useCases/UseCase'
import { Notification } from '../models/Notification'
import { INotificationsRepository } from '../repositories/INotificationsRepository'

export class GetAllNotificationsByUser implements UseCase<Notification[]> {
  constructor(private readonly notificationsRepository: INotificationsRepository) {}

  /**
   * Use case for retrieving all notifications for the current user.
   *
   * @returns {Promise<Notification[]>} - A promise that resolves to an array of Notification instances.
   */
  async execute(): Promise<Notification[]> {
    return (await this.notificationsRepository.getAllNotificationsByUser()) as Notification[]
  }
}
