import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IUsersRepository } from '../repositories/IUsersRepository'

export class DeleteCurrentApiToken implements UseCase<void> {
  private usersRepository: IUsersRepository

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository
  }

  /**
   * Deletes the API token of the current authenticated user in ApiConfig.
   *
   * @returns {Promise<void>}
   */
  async execute(): Promise<void> {
    return await this.usersRepository.deleteCurrentApiToken()
  }
}
