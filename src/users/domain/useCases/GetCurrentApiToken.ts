import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ApiTokenInfo } from '../models/ApiTokenInfo'
import { IUsersRepository } from '../repositories/IUsersRepository'

export class GetCurrentApiToken implements UseCase<ApiTokenInfo> {
  private usersRepository: IUsersRepository

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository
  }

  /**
   * Returns the current ApiTokenInfo corresponding to the current authenticated user.
   *
   * @returns {Promise<ApiTokenInfo>}
   */
  async execute(): Promise<ApiTokenInfo> {
    return await this.usersRepository.getCurrentApiToken()
  }
}
