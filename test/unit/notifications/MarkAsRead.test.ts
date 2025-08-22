import { MarkNotificationAsRead } from '../../../src/notifications/domain/useCases/MarkNotificationAsRead'
import { INotificationsRepository } from '../../../src/notifications/domain/repositories/INotificationsRepository'
import { ReadError } from '../../../src'

describe('MarkNotificationAsRead', () => {
  test('should mark notification as read in repository', async () => {
    const notificationsRepositoryStub: INotificationsRepository = {} as INotificationsRepository

    notificationsRepositoryStub.markNotificationAsRead = jest.fn().mockResolvedValue(undefined)
    const sut = new MarkNotificationAsRead(notificationsRepositoryStub)

    await sut.execute(123)

    expect(notificationsRepositoryStub.markNotificationAsRead).toHaveBeenCalledWith(123)
  })

  test('should throw error when repository throws error', async () => {
    const notificationsRepositoryStub: INotificationsRepository = {} as INotificationsRepository
    notificationsRepositoryStub.markNotificationAsRead = jest
      .fn()
      .mockRejectedValue(new ReadError())
    const sut = new MarkNotificationAsRead(notificationsRepositoryStub)

    await expect(sut.execute(123)).rejects.toThrow(ReadError)
  })
})
