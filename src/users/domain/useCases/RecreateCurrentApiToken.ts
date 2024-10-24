import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ApiTokenInfo } from '../models/ApiTokenInfo'
import { IUsersRepository } from '../repositories/IUsersRepository'

export class RecreateCurrentApiToken implements UseCase<ApiTokenInfo> {
  private usersRepository: IUsersRepository

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository
  }

  /**
   * Reacreates the API token of the current authenticated user and returns the new ApiTokenInfo.
   *
   * @returns {Promise<ApiTokenInfo>}
   */
  async execute(): Promise<ApiTokenInfo> {
    return await this.usersRepository.recreateCurrentApiToken()
  }
}
