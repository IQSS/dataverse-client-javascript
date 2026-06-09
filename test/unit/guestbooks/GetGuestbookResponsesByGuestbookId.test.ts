import { ReadError } from '../../../src'
import {
  EventType,
  GuestbookResponse
} from '../../../src/guestbooks/domain/models/GuestbookResponse'
import { IGuestbooksRepository } from '../../../src/guestbooks/domain/repositories/IGuestbooksRepository'
import { getGuestbookResponsesByGuestbookId } from '../../../src/guestbooks/domain/useCases/getGuestbookResponsesByGuestbookId'

describe('getGuestbookResponsesByGuestbookId', () => {
  const guestbookId = 12
  const limit = 10
  const offset = 0
  const guestbookResponses: GuestbookResponse[] = [
    {
      id: 13,
      dataset: 'Replication Data for:',
      datasetPid: 'FK2/BQEPWW',
      date: '2026-06-08T23:50:49Z',
      type: EventType.DOWNLOAD,
      fileName: 'dp_statistics_for_grade_grouped_by_student_id.html',
      fileId: 3,
      userName: 'Guest',
      email: 'guest@example.edu',
      customQuestions: [
        {
          question: 'What is your intended use?',
          response: 'Teaching'
        }
      ]
    }
  ]

  test('should return guestbook responses for one guestbook', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.getGuestbookResponsesByGuestbookId = jest.fn().mockResolvedValue(guestbookResponses)

    const sut = new getGuestbookResponsesByGuestbookId(repository)
    const actual = await sut.execute(guestbookId)

    expect(repository.getGuestbookResponsesByGuestbookId).toHaveBeenCalledWith(
      guestbookId,
      limit,
      offset
    )
    expect(actual).toEqual(guestbookResponses)
  })

  test('should pass pagination to repository', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.getGuestbookResponsesByGuestbookId = jest.fn().mockResolvedValue(guestbookResponses)

    const sut = new getGuestbookResponsesByGuestbookId(repository)
    await sut.execute(guestbookId, 25, 50)

    expect(repository.getGuestbookResponsesByGuestbookId).toHaveBeenCalledWith(guestbookId, 25, 50)
  })

  test('should throw ReadError when repository fails', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.getGuestbookResponsesByGuestbookId = jest.fn().mockRejectedValue(new ReadError())
    const sut = new getGuestbookResponsesByGuestbookId(repository)

    await expect(sut.execute(guestbookId)).rejects.toThrow(ReadError)
  })
})
