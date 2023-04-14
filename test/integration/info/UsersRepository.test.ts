import { UsersRepository } from '../../../src/users/infra/repositories/UsersRepository';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { assert } from 'sinon';

describe('getCurrentAuthenticatedUser', () => {
  // TODO: Change API URL to another of an integration test oriented Dataverse instance
  const sut: UsersRepository = new UsersRepository('https://demo.dataverse.org/api/v1');

  test('should return error when authentication is not provided', async () => {
    let error: ReadError = undefined;
    await sut.getCurrentAuthenticatedUser().catch((e) => (error = e));

    assert.match(
      error.message,
      'There was an error when reading the resource. Reason was: [400] User with token null not found.',
    );
  });

  // TODO: Add more test cases once the integration test environment is established
});
