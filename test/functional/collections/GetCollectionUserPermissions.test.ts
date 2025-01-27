import { ApiConfig, ReadError, getCollectionUserPermissions } from '../../../src'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'

import { ROOT_COLLECTION_ALIAS } from '../../testHelpers/collections/collectionHelper'

describe('execute', () => {
  beforeEach(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  test('should return user permissions for the default collection', async () => {
    try {
      const permissions = await getCollectionUserPermissions.execute()

      expect(permissions.canAddDataset).toBe(true)
      expect(permissions.canAddCollection).toBe(true)
      expect(permissions.canDeleteCollection).toBe(true)
      expect(permissions.canEditCollection).toBe(true)
      expect(permissions.canManageCollectionPermissions).toBe(true)
      expect(permissions.canPublishCollection).toBe(true)
      expect(permissions.canViewUnpublishedCollection).toBe(true)
    } catch (error) {
      throw new Error('Permissions should be retrieved')
    }
  })
  test('should return user permissions when a valid collection alias is provided', async () => {
    try {
      const permissions = await getCollectionUserPermissions.execute(ROOT_COLLECTION_ALIAS)

      expect(permissions.canAddDataset).toBe(true)
      expect(permissions.canAddCollection).toBe(true)
      expect(permissions.canDeleteCollection).toBe(true)
      expect(permissions.canEditCollection).toBe(true)
      expect(permissions.canManageCollectionPermissions).toBe(true)
      expect(permissions.canPublishCollection).toBe(true)
      expect(permissions.canViewUnpublishedCollection).toBe(true)
    } catch (error) {
      throw new Error('Permissions should be retrieved')
    }
  })

  test('should throw an error when collection does not exist', async () => {
    expect.assertions(2)
    let readError: ReadError | undefined = undefined
    try {
      await getCollectionUserPermissions.execute(TestConstants.TEST_DUMMY_COLLECTION_ID)
      throw new Error('Use case should throw an error')
    } catch (error) {
      readError = error as ReadError
    } finally {
      expect(readError).toBeInstanceOf(ReadError)
      expect(readError?.message).toEqual(
        `There was an error when reading the resource. Reason was: [404] Can't find dataverse with identifier='${TestConstants.TEST_DUMMY_COLLECTION_ID}'`
      )
    }
  })
})
