import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { IRolesRepository } from '../../domain/repositories/IRolesRepository'
import { Role } from '../../domain/models/Role'
import { transformRolesUserSelectableResponseToRoles } from '../../domain/repositories/transformers/roleTransformers'

export class RolesRepository extends ApiRepository implements IRolesRepository {
  private readonly rolesResourceName: string = 'roles'
  public async getUserSelectableRoles(): Promise<Role[]> {
    return this.doGet(`/${this.rolesResourceName}/userSelectable`, true)
      .then((response) => transformRolesUserSelectableResponseToRoles(response))
      .catch((error) => {
        throw error
      })
  }
}
