import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IUsersRepository } from '../repositories/IUsersRepository'

export class GetOrcidSignUpAuthorizationUrl implements UseCase<string> {
  private usersRepository: IUsersRepository

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository
  }

  /**
   * Returns the ORCID authorization URL that sends a new user to ORCID to authenticate their ORCID iD while signing up.
   * No authentication is used.
   *
   * @param {string} [redirectUri] - The URL ORCID redirects back to. Must be allowed by the installation's dataverse.api.signup.orcid-redirect-uris setting.
   * @returns {Promise<string>} - The ORCID authorization URL.
   * @throws {ReadError} - If ORCID is not configured, or the redirect URI is not allowed.
   */
  async execute(redirectUri: string): Promise<string> {
    return await this.usersRepository.getOrcidSignUpAuthorizationUrl(redirectUri)
  }
}
