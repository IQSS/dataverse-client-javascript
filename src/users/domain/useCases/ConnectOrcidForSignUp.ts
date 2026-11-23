import { UseCase } from '../../../core/domain/useCases/UseCase'
import { OrcidSignUpCallbackDTO } from '../dtos/OrcidSignUpCallbackDTO'
import { OrcidSignUpConnection } from '../models/OrcidSignUpConnection'
import { IUsersRepository } from '../repositories/IUsersRepository'

export class ConnectOrcidForSignUp implements UseCase<OrcidSignUpConnection> {
  private usersRepository: IUsersRepository

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository
  }

  /**
   * Exchanges the code and state that ORCID returns to the redirect URI for the user's authenticated ORCID iD.
   * No authentication is used.
   *
   * @param {OrcidSignUpCallbackDTO} [callback] - The code and state from ORCID's redirect, and the same redirectUri used to get the authorization URL.
   * @returns {Promise<OrcidSignUpConnection>} - The ORCID iD, any details the user shares on ORCID, and an orcidToken to include when signing up.
   * @throws {WriteError} - If the state is invalid or expired, ORCID rejects the code, or the ORCID iD is already linked to another account (statusCode 409).
   */
  async execute(callback: OrcidSignUpCallbackDTO): Promise<OrcidSignUpConnection> {
    return await this.usersRepository.connectOrcidForSignUp(callback)
  }
}
