import { ApiConfig, CollectionFacet, ReadError, getCollectionFacets } from '../../../src'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { ROOT_COLLECTION_ALIAS } from '../../../src/collections/domain/models/Collection'

describe('execute', () => {
  beforeEach(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  test('should return facets when a valid collection alias is provided', async () => {
    let actual: CollectionFacet[] = []
    try {
      actual = await getCollectionFacets.execute(ROOT_COLLECTION_ALIAS)
    } catch (error) {
      throw new Error('Facets should be retrieved')
    } finally {
      expect(actual[0].name).toBe('authorName')
      expect(actual.length).toBe(4)
    }
  })

  test('should throw an error when collection does not exist', async () => {
    expect.assertions(2)
    let readError: ReadError
    try {
      await getCollectionFacets.execute(TestConstants.TEST_DUMMY_COLLECTION_ID)
      throw new Error('Use case should throw an error')
    } catch (error) {
      readError = error
    } finally {
      expect(readError).toBeInstanceOf(ReadError)
      expect(readError.message).toEqual(
        `There was an error when reading the resource. Reason was: [404] Can't find dataverse with identifier='${TestConstants.TEST_DUMMY_COLLECTION_ID}'`
      )
    }
  })
})
