export interface UseCase<T> {
  execute(...args: any[]): Promise<T>;
}
