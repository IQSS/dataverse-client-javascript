import { UsersRepository } from './infra/repositories/UsersRepository';
import { GetCurrentAuthenticatedUser } from './domain/useCases/GetCurrentAuthenticatedUser';

const getCurrentAuthenticatedUser = new GetCurrentAuthenticatedUser(new UsersRepository(process.env.DATAVERSE_API_URL));

export { getCurrentAuthenticatedUser };
