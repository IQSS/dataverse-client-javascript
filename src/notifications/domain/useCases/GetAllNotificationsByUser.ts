import { UseCase } from '../../../core/domain/useCases/UseCase'
import { INotificationsRepository } from '../repositories/INotificationsRepository'
import { NotificationSubset } from '../models/NotificationSubset'

export class GetAllNotificationsByUser implements UseCase<NotificationSubset> {
  constructor(private readonly notificationsRepository: INotificationsRepository) {}

  /**
   * Use case for retrieving all notifications for the current user.
   *
   * @param inAppNotificationFormat - Optional parameter to retrieve fields needed for in-app notifications
   * @param onlyUnread - Optional parameter to filter only unread notifications
   * @param limit - Optional parameter to limit the number of notifications returned
   * @param offset - Optional parameter to skip a number of notifications (for pagination)
   * @returns {Promise<NotificationSubset>} - A promise that resolves to an array of Notification instances.
   */
  async execute(
    inAppNotificationFormat?: boolean,
    onlyUnread?: boolean,
    limit?: number,
    offset?: number
  ): Promise<NotificationSubset> {
    return (await this.notificationsRepository.getAllNotificationsByUser(
      inAppNotificationFormat,
      onlyUnread,
      limit,
      offset
    )) as NotificationSubset
  }
}
