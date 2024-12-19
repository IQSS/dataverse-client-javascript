import { UseCase } from '../../../core/domain/useCases/UseCase'
import { UserDTO } from '../dtos/UserDTO'
import { IUsersRepository } from '../repositories/IUsersRepository'

export class RegisterUser implements UseCase<void> {
  private usersRepository: IUsersRepository

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository
  }

  /**
   * Registers a new user, given a UserDTO object. Only available through DataverseApiAuthMechanism.BEARER_TOKEN auth mechanism.
   *
   * @param {UserDTO} [userDTO] - UserDTO object including the new user data.
   * @returns {Promise<void>} - This method does not return anything upon successful completion.
   * @throws {WriteError} - If there are errors while writing data.
   */
  async execute(userDTO: UserDTO): Promise<void> {
    return await this.usersRepository.registerUser(userDTO)
  }
}
