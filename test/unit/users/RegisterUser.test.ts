import { RegisterUser } from '../../../src/users/domain/useCases/RegisterUser'
import { IUsersRepository } from '../../../src/users/domain/repositories/IUsersRepository'
import { UserDTO, WriteError } from '../../../src'

describe('execute', () => {
  const testUserDTO: UserDTO = {
    username: 'johndoe',
    firstName: 'John',
    lastName: 'Doe',
    emailAddress: 'johndoe@email.com',
    position: '',
    affiliation: '',
    termsAccepted: true
  }

  test('should return undefined on repository success', async () => {
    const usersRepositoryStub: IUsersRepository = {} as IUsersRepository
    usersRepositoryStub.registerUser = jest.fn().mockResolvedValue(undefined)
    const testRegisterUser = new RegisterUser(usersRepositoryStub)

    const actual = await testRegisterUser.execute(testUserDTO)

    expect(actual).toEqual(undefined)
  })

  test('should return error result on repository error', async () => {
    const usersRepositoryStub: IUsersRepository = {} as IUsersRepository
    usersRepositoryStub.registerUser = jest.fn().mockRejectedValue(new WriteError())
    const testRegisterUser = new RegisterUser(usersRepositoryStub)

    await expect(testRegisterUser.execute(testUserDTO)).rejects.toThrow(WriteError)
  })
})
