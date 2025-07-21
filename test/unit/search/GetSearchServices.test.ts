import { ReadError } from '../../../src'
import { ISearchServicesRepository } from '../../../src/search/domain/repositories/ISearchServicesRepository'
import { GetSearchServices } from '../../../src/search/domain/useCases/GetSearchServices'
import { createSearchServiceModelArray } from '../../testHelpers/search/searchServiceHelper'

describe('execute', () => {
  test('should return search services array on repository success', async () => {
    const searchServicesRepositoryStub: ISearchServicesRepository = {} as ISearchServicesRepository
    const testServices = createSearchServiceModelArray(5)
    searchServicesRepositoryStub.getSearchServices = jest.fn().mockResolvedValue(testServices)
    const sut = new GetSearchServices(searchServicesRepositoryStub)

    const actual = await sut.execute()

    expect(actual).toEqual(testServices)
  })

  test('should return error result on repository error', async () => {
    const searchServicesRepositoryStub: ISearchServicesRepository = {} as ISearchServicesRepository
    searchServicesRepositoryStub.getSearchServices = jest.fn().mockRejectedValue(new ReadError())
    const sut = new GetSearchServices(searchServicesRepositoryStub)

    await expect(sut.execute()).rejects.toThrow(ReadError)
  })
})
