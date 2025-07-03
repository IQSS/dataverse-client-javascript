import { UseCase } from '../../../core/domain/useCases/UseCase'
import { Role } from '../models/Role'
import { IRolesRepository } from '../repositories/IRolesRepository'

export class GetUserSelectableRoles implements UseCase<Role[]> {
  constructor(private readonly rolesRepository: IRolesRepository) {}

  /**
   * Returns the appropriate roles that the calling user can use as filters when searching within their data.
   *
   * @returns {Promise<Role[]>} - A promise that resolves to an array of Role instances.
   */
  async execute(): Promise<Role[]> {
    return (await this.rolesRepository.getUserSelectableRoles()) as Role[]
  }
}
