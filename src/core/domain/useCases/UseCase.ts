export interface UseCase<T> {
  execute(...args: unknown[]): Promise<T>
}
