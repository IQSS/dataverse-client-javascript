import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'
import { RolesRepository } from '../../../src/roles/infra/repositories/RolesRepository'
import { createSuperAdminRoleArray } from '../../testHelpers/roles/roleHelper'

describe('RolesRepository', () => {
  const sut: RolesRepository = new RolesRepository()

  describe('getUserSelectableRoles', () => {
    test('should return list of selectable roles for authenticated user', async () => {
      ApiConfig.init(
        TestConstants.TEST_API_URL,
        DataverseApiAuthMechanism.API_KEY,
        process.env.TEST_API_KEY
      )
      const actual = await sut.getUserSelectableRoles()
      expect(actual).toStrictEqual(createSuperAdminRoleArray())
    })
  })
})
