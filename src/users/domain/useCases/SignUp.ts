import { UseCase } from '../../../core/domain/useCases/UseCase'
import { SignUpDTO } from '../dtos/SignUpDTO'
import { SignUpResult } from '../models/SignUpResult'
import { IUsersRepository } from '../repositories/IUsersRepository'

export class SignUp implements UseCase<SignUpResult> {
  private usersRepository: IUsersRepository

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository
  }

  /**
   * Signs up a new builtin user account. No authentication is used, so it works for anonymous users.
   * Requires the api-builtin-user-signup feature flag on the Dataverse installation.
   *
   * @param {SignUpDTO} [signUpDTO] - The new user's details and password. Include orcidToken (from connectOrcidForSignUp) to save an authenticated ORCID iD to the account.
   * @returns {Promise<SignUpResult>} - status 'created' with the new user's identifier when the account was created, or status 'pending' when the installation requires email verification before creating it.
   * @throws {WriteError} - If the sign-up fails. Its fieldErrors property maps invalid fields to their error messages.
   */
  async execute(signUpDTO: SignUpDTO): Promise<SignUpResult> {
    return await this.usersRepository.signUp(signUpDTO)
  }
}
