import { GetUnreadCount } from '../../../src/notifications/domain/useCases/GetUnreadCount'
import { INotificationsRepository } from '../../../src/notifications/domain/repositories/INotificationsRepository'
import { ReadError } from '../../../src'

describe('GetUnreadCount', () => {
  test('should return unread count from repository', async () => {
    const notificationsRepositoryStub: INotificationsRepository = {} as INotificationsRepository

    notificationsRepositoryStub.getUnreadCount = jest.fn().mockResolvedValue(5)
    const sut = new GetUnreadCount(notificationsRepositoryStub)

    const result = await sut.execute()

    expect(notificationsRepositoryStub.getUnreadCount).toHaveBeenCalledWith()
    expect(result).toBe(5)
  })

  test('should throw error when repository throws error', async () => {
    const notificationsRepositoryStub: INotificationsRepository = {} as INotificationsRepository
    notificationsRepositoryStub.getUnreadCount = jest.fn().mockRejectedValue(new ReadError())
    const sut = new GetUnreadCount(notificationsRepositoryStub)

    await expect(sut.execute()).rejects.toThrow(ReadError)
  })
})
