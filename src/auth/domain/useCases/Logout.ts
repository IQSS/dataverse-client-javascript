import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IAuthRepository } from '../repositories/IAuthRepository'

export class Logout implements UseCase<void> {
  private authRepository: IAuthRepository

  constructor(logoutRepository: IAuthRepository) {
    this.authRepository = logoutRepository
  }

  async execute(): Promise<void> {
    await this.authRepository.logout()
  }
}
