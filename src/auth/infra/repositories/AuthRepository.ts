import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { IAuthRepository } from '../../domain/repositories/IAuthRepository'

export class AuthRepository extends ApiRepository implements IAuthRepository {
  public async logout(): Promise<void> {
    return this.doPost('/logout', '')
      .then(() => undefined)
      .catch((error) => {
        throw error
      })
  }
}
