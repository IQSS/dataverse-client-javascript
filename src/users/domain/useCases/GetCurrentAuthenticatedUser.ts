import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IUsersRepository } from '../repositories/IUsersRepository'
import { AuthenticatedUser } from '../models/AuthenticatedUser'

export class GetCurrentAuthenticatedUser implements UseCase<AuthenticatedUser> {
  private usersRepository: IUsersRepository

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository
  }

  /**
   * Returns the current AuthenticatedUser corresponding to the authentication mechanism provided through ApiConfig.
   *
   * @returns {Promise<AuthenticatedUser>}
   */
  async execute(): Promise<AuthenticatedUser> {
    return await this.usersRepository.getCurrentAuthenticatedUser()
  }
}
