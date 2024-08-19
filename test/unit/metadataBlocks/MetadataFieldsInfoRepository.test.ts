import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import {
  createMetadataFieldInfoModel,
  createMetadataFieldInfoPayload
} from '../../testHelpers/metadataBlocks/metadataBlockHelper'
import { TestConstants } from '../../testHelpers/TestConstants'
import axios from 'axios'
import { MetadataFieldInfosRepository } from '../../../src/metadataBlocks/infra/repositories/MetadataFieldInfosRepository'

describe('MetadataFieldsInfoRepository', () => {
  const sut: MetadataFieldInfosRepository = new MetadataFieldInfosRepository()

  beforeEach(() => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      TestConstants.TEST_DUMMY_API_KEY
    )
  })

  describe('getAllFacetableMetadataFields', () => {
    test('should return all facetable dataset fields on successful response', async () => {
      const testSuccessfulResponse = {
        data: {
          status: 'OK',
          data: [createMetadataFieldInfoPayload()]
        }
      }
      jest.spyOn(axios, 'get').mockResolvedValue(testSuccessfulResponse)

      const actual = await sut.getAllFacetableMetadataFields()

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/datasetfields/facetables`,
        TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG
      )
      expect(actual[0]).toMatchObject(createMetadataFieldInfoModel())
      expect(actual.length).toEqual(1)
    })
  })
})
