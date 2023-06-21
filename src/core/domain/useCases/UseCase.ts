export interface UseCase<T> {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  execute(...args: any[]): Promise<T>;
}
