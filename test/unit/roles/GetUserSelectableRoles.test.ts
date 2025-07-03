import { ReadError } from '../../../src'
import { IRolesRepository } from '../../../src/roles/domain/repositories/IRolesRepository'
import { createRoleModelArray } from '../../testHelpers/roles/roleHelper'
import { GetUserSelectableRoles } from '../../../src/roles/domain/useCases/GetUserSelectableRoles'

describe('execute', () => {
  test('should return roles array on repository success', async () => {
    const rolesRepositoryStub: IRolesRepository = {} as IRolesRepository
    const testRoles = createRoleModelArray(5)
    rolesRepositoryStub.getUserSelectableRoles = jest.fn().mockResolvedValue(testRoles)
    const sut = new GetUserSelectableRoles(rolesRepositoryStub)

    const actual = await sut.execute()

    expect(actual).toEqual(testRoles)
  })

  test('should return error result on repository error', async () => {
    const rolesRepositoryStub: IRolesRepository = {} as IRolesRepository
    rolesRepositoryStub.getUserSelectableRoles = jest.fn().mockRejectedValue(new ReadError())
    const sut = new GetUserSelectableRoles(rolesRepositoryStub)

    await expect(sut.execute()).rejects.toThrow(ReadError)
  })
})
