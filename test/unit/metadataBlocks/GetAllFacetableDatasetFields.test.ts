import { ReadError } from '../../../src'
import { createMetadataFieldInfoModel } from '../../testHelpers/metadataBlocks/metadataBlockHelper'
import { IMetadataFieldInfosRepository } from '../../../src/metadataBlocks/domain/repositories/IMetadataFieldInfosRepository'
import { GetAllFacetableDatasetFields } from '../../../src/metadataBlocks/domain/useCases/GetAllFacetableDatasetFields'

describe('execute', () => {
  test('should return all facetable dataset fields on repository success', async () => {
    const testMetadataFieldInfos = [createMetadataFieldInfoModel()]
    const metadataFieldInfosRepositoryStub: IMetadataFieldInfosRepository =
      {} as IMetadataFieldInfosRepository
    metadataFieldInfosRepositoryStub.getAllFacetableMetadataFields = jest
      .fn()
      .mockResolvedValue(testMetadataFieldInfos)
    const testGetAllFacetableDatasetFields = new GetAllFacetableDatasetFields(
      metadataFieldInfosRepositoryStub
    )

    const actual = await testGetAllFacetableDatasetFields.execute()

    expect(actual).toEqual(testMetadataFieldInfos)
  })

  test('should return error result on repository error', async () => {
    const metadataFieldInfosRepositoryStub: IMetadataFieldInfosRepository =
      {} as IMetadataFieldInfosRepository
    metadataFieldInfosRepositoryStub.getAllFacetableMetadataFields = jest
      .fn()
      .mockRejectedValue(new ReadError())
    const testGetAllFacetableDatasetFields = new GetAllFacetableDatasetFields(
      metadataFieldInfosRepositoryStub
    )

    await expect(testGetAllFacetableDatasetFields.execute()).rejects.toThrow(ReadError)
  })
})
