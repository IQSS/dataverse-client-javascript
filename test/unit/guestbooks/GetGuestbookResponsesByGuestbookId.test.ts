import { ReadError } from '../../../src'
import {
  EventType,
  GuestbookResponse,
  GuestbookResponseSubset
} from '../../../src/guestbooks/domain/models/GuestbookResponse'
import { IGuestbooksRepository } from '../../../src/guestbooks/domain/repositories/IGuestbooksRepository'
import { GetGuestbookResponsesByGuestbookId } from '../../../src/guestbooks/domain/useCases/GetGuestbookResponsesByGuestbookId'

describe('GetGuestbookResponsesByGuestbookId', () => {
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
  const guestbookResponseSubset: GuestbookResponseSubset = {
    guestbookResponses,
    totalGuestbookResponseCount: guestbookResponses.length
  }

  test('should return guestbook responses for one guestbook', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.getGuestbookResponsesByGuestbookId = jest
      .fn()
      .mockResolvedValue(guestbookResponseSubset)

    const sut = new GetGuestbookResponsesByGuestbookId(repository)
    const actual = await sut.execute(guestbookId)

    expect(repository.getGuestbookResponsesByGuestbookId).toHaveBeenCalledWith(
      guestbookId,
      limit,
      offset
    )
    expect(actual).toEqual(guestbookResponseSubset)
  })

  test('should pass pagination to repository', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.getGuestbookResponsesByGuestbookId = jest
      .fn()
      .mockResolvedValue(guestbookResponseSubset)

    const sut = new GetGuestbookResponsesByGuestbookId(repository)
    await sut.execute(guestbookId, 25, 50)

    expect(repository.getGuestbookResponsesByGuestbookId).toHaveBeenCalledWith(guestbookId, 25, 50)
  })

  test('should throw ReadError when repository fails', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.getGuestbookResponsesByGuestbookId = jest.fn().mockRejectedValue(new ReadError())
    const sut = new GetGuestbookResponsesByGuestbookId(repository)

    await expect(sut.execute(guestbookId)).rejects.toThrow(ReadError)
  })
})
