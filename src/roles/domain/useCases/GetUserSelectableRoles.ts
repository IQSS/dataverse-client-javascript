import { UseCase } from '../../../core/domain/useCases/UseCase'
import { Role } from '../models/Role'
import { IRolesRepository } from '../repositories/IRolesRepository'

export class GetUserSelectableRoles implements UseCase<Role[]> {
  constructor(private readonly rolesRepository: IRolesRepository) {}

  /**
   * Returns an array of Roles, for the currently logged in user.
   *
   * @returns {Promise<Role[]>} - A promise that resolves to an array of Role instances that the user can select.
   */
  async execute(): Promise<Role[]> {
    return (await this.rolesRepository.getUserSelectableRoles()) as Role[]
  }
}
