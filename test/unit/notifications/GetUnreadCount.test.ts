import { GetUnreadNotificationsCount } from '../../../src/notifications/domain/useCases/GetUnreadNotificationsCount'
import { INotificationsRepository } from '../../../src/notifications/domain/repositories/INotificationsRepository'
import { ReadError } from '../../../src'

describe('GetUnreadNotificationsCount', () => {
  test('should return unread count from repository', async () => {
    const notificationsRepositoryStub: INotificationsRepository = {} as INotificationsRepository

    notificationsRepositoryStub.getUnreadNotificationsCount = jest.fn().mockResolvedValue(5)
    const sut = new GetUnreadNotificationsCount(notificationsRepositoryStub)

    const result = await sut.execute()

    expect(notificationsRepositoryStub.getUnreadNotificationsCount).toHaveBeenCalledWith()
    expect(result).toBe(5)
  })

  test('should throw error when repository throws error', async () => {
    const notificationsRepositoryStub: INotificationsRepository = {} as INotificationsRepository
    notificationsRepositoryStub.getUnreadNotificationsCount = jest
      .fn()
      .mockRejectedValue(new ReadError())
    const sut = new GetUnreadNotificationsCount(notificationsRepositoryStub)

    await expect(sut.execute()).rejects.toThrow(ReadError)
  })
})
