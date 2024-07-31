import { ReadError } from '../../../src'
import { createMetadataFieldInfoModel } from '../../testHelpers/metadataBlocks/metadataBlockHelper'
import { IMetadataFieldInfosRepository } from '../../../src/metadataBlocks/domain/repositories/IMetadataFieldInfosRepository'
import { GetAllFacetableMetadataFields } from '../../../src/metadataBlocks/domain/useCases/GetAllFacetableMetadataFields'

describe('execute', () => {
  test('should return all facetable dataset fields on repository success', async () => {
    const testMetadataFieldInfos = [createMetadataFieldInfoModel()]
    const metadataFieldInfosRepositoryStub: IMetadataFieldInfosRepository =
      {} as IMetadataFieldInfosRepository
    metadataFieldInfosRepositoryStub.getAllFacetableMetadataFields = jest
      .fn()
      .mockResolvedValue(testMetadataFieldInfos)
    const testGetAllFacetableMetadataFields = new GetAllFacetableMetadataFields(
      metadataFieldInfosRepositoryStub
    )

    const actual = await testGetAllFacetableMetadataFields.execute()

    expect(actual).toEqual(testMetadataFieldInfos)
  })

  test('should return error result on repository error', async () => {
    const metadataFieldInfosRepositoryStub: IMetadataFieldInfosRepository =
      {} as IMetadataFieldInfosRepository
    metadataFieldInfosRepositoryStub.getAllFacetableMetadataFields = jest
      .fn()
      .mockRejectedValue(new ReadError())
    const testGetAllFacetableMetadataFields = new GetAllFacetableMetadataFields(
      metadataFieldInfosRepositoryStub
    )

    await expect(testGetAllFacetableMetadataFields.execute()).rejects.toThrow(ReadError)
  })
})
