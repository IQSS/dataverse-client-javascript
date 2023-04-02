import { Result } from './Result';

export interface UseCase<T> {
  execute(...args: any[]): Promise<Result<T>>;
}
