import { LinkDatasetTypeWithMetadataBlocks } from '../../../src/datasets/domain/useCases/LinkDatasetTypeWithMetadataBlocks'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { WriteError } from '../../../src'

describe('execute', () => {
  test('should return undefined on link dataset type with metadata block success', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.linkDatasetTypeWithMetadataBlocks = jest
      .fn()
      .mockResolvedValue(undefined)
    const sut = new LinkDatasetTypeWithMetadataBlocks(datasetsRepositoryStub)

    const actual = await sut.execute(1, ['geospatial'])
    expect(actual).toEqual(undefined)
  })

  test('should return error result on link dataset type with metadata block error', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.linkDatasetTypeWithMetadataBlocks = jest
      .fn()
      .mockRejectedValue(new WriteError())
    const sut = new LinkDatasetTypeWithMetadataBlocks(datasetsRepositoryStub)

    const nonExistentDatasetTypeId = 111
    await expect(sut.execute(nonExistentDatasetTypeId, ['geospatial'])).rejects.toThrow(WriteError)
  })
})
