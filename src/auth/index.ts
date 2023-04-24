import { AuthRepository } from './infra/repositories/AuthRepository';
import { Logout } from './domain/useCases/Logout';

const logout = new Logout(new AuthRepository());

export { logout };
