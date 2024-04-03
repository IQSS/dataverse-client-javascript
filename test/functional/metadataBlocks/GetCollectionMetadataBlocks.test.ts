import { ApiConfig, getCollectionMetadataBlocks, MetadataBlock, ReadError } from '../../../src'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'

describe('execute', () => {
  beforeEach(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  test('should successfully return collection metadatablocks when collection exists', async () => {
    let collectionMetadataBlocks: MetadataBlock[] = null
    try {
      collectionMetadataBlocks = await getCollectionMetadataBlocks.execute('root')
    } catch (error) {
      throw new Error('Should not raise an error')
    } finally {
      expect(collectionMetadataBlocks).not.toBeNull()
      expect(collectionMetadataBlocks.length).toBe(1)
      expect(collectionMetadataBlocks[0].metadataFields.title.name).toBe('title')
    }
  })

  test('should throw an error when a collection is not found', async () => {
    expect.assertions(2)
    let readError: ReadError
    try {
      await getCollectionMetadataBlocks.execute('notFoundCollectionAlias')
      throw new Error('Use case should throw an error')
    } catch (error) {
      readError = error
    } finally {
      expect(readError).toBeInstanceOf(ReadError)
      expect(readError.message).toEqual(
        `There was an error when reading the resource. Reason was: [404] Can't find dataverse with identifier='notFoundCollectionAlias'`
      )
    }
  })
})
