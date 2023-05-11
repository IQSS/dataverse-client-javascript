import { GetCurrentAuthenticatedUser } from '../../../src/users/domain/useCases/GetCurrentAuthenticatedUser';
import { IUsersRepository } from '../../../src/users/domain/repositories/IUsersRepository';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { assert, createSandbox, SinonSandbox } from 'sinon';
import { createAuthenticatedUser } from '../../testHelpers/users/authenticatedUserHelper';

describe('execute', () => {
  const sandbox: SinonSandbox = createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  test('should return successful result with authenticated user on repository success', async () => {
    const testAuthenticatedUser = createAuthenticatedUser();
    const usersRepositoryStub = <IUsersRepository>{};
    usersRepositoryStub.getCurrentAuthenticatedUser = sandbox.stub().returns(testAuthenticatedUser);
    const sut = new GetCurrentAuthenticatedUser(usersRepositoryStub);

    const actual = await sut.execute();

    assert.match(actual, testAuthenticatedUser);
  });

  test('should return error result on repository error', async () => {
    const usersRepositoryStub = <IUsersRepository>{};
    const testReadError = new ReadError();
    usersRepositoryStub.getCurrentAuthenticatedUser = sandbox.stub().throwsException(testReadError);
    const sut = new GetCurrentAuthenticatedUser(usersRepositoryStub);

    let actualError: ReadError = undefined;
    await sut.execute().catch((e) => (actualError = e));

    assert.match(actualError, testReadError);
  });
});
