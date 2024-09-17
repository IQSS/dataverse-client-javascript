import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IUsersRepository } from '../repositories/IUsersRepository'

export class RecreateApiToken implements UseCase<string> {
  private usersRepository: IUsersRepository

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository
  }

  /**
   * Reacreates the API token of the current authenticated user and returns the new one.
   *
   * @returns {Promise<AuthenticatedUser>}
   */
  async execute(): Promise<string> {
    return await this.usersRepository.recreateApiToken()
  }
}
