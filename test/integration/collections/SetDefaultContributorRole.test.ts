import { SetDefaultContributorRole } from '../../../src/collections/domain/useCases/SetDefaultContributorRole'
import { CollectionsRepository } from '../../../src/collections/infra/repositories/CollectionsRepository'
import { ApiConfig } from '../../../src'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import {
  createCollectionViaApi,
  deleteCollectionViaApi
} from '../../testHelpers/collections/collectionHelper'
import { RoleAlias } from '../../../src/roles/domain/models/RoleAlias'
import { WriteError } from '../../../src/core/domain/repositories/WriteError'

describe('SetDefaultContributorRole', () => {
  const collectionsRepository = new CollectionsRepository()
  const useCase = new SetDefaultContributorRole(collectionsRepository)
  const testCollectionAlias = 'setDefaultContributorRoleTestCollection'

  beforeAll(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
    await createCollectionViaApi(testCollectionAlias)
  })

  afterAll(async () => {
    await deleteCollectionViaApi(testCollectionAlias)
  })

  test('should successfully set the default contributor role', async () => {
    const roleAlias = RoleAlias.CURATOR

    await expect(useCase.execute(testCollectionAlias, roleAlias)).resolves.toBeUndefined()
  })

  test('should successfully set the default contributor role for the root collection', async () => {
    const roleAlias = RoleAlias.CURATOR

    await expect(useCase.execute(undefined, roleAlias)).resolves.toBeUndefined()
  })

  test('should throw an error when the collection does not exist', async () => {
    const nonExistentCollection = 'nonExistentCollection'
    const roleAlias = RoleAlias.CURATOR

    await expect(useCase.execute(nonExistentCollection, roleAlias)).rejects.toThrow(WriteError)
  })

  test('should throw an error when the role alias does not exist', async () => {
    const nonExistentRoleAlias = 'invalidRoleAlias'

    await expect(useCase.execute(testCollectionAlias, nonExistentRoleAlias)).rejects.toThrow(WriteError)
  })
})
