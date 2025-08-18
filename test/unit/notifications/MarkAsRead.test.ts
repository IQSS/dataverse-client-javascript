import { MarkAsRead } from '../../../src/notifications/domain/useCases/MarkAsRead'
import { INotificationsRepository } from '../../../src/notifications/domain/repositories/INotificationsRepository'
import { ReadError } from '../../../src'

describe('MarkAsRead', () => {
  test('should mark notification as read in repository', async () => {
    const notificationsRepositoryStub: INotificationsRepository = {} as INotificationsRepository

    notificationsRepositoryStub.markAsRead = jest.fn().mockResolvedValue(undefined)
    const sut = new MarkAsRead(notificationsRepositoryStub)

    await sut.execute(123)

    expect(notificationsRepositoryStub.markAsRead).toHaveBeenCalledWith(123)
  })

  test('should throw error when repository throws error', async () => {
    const notificationsRepositoryStub: INotificationsRepository = {} as INotificationsRepository
    notificationsRepositoryStub.markAsRead = jest.fn().mockRejectedValue(new ReadError())
    const sut = new MarkAsRead(notificationsRepositoryStub)

    await expect(sut.execute(123)).rejects.toThrow(ReadError)
  })
})
