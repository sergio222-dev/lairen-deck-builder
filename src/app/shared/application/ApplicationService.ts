export interface ApplicationService<T extends Array<any> = any, X = any> {
  execute(...args: T): X;
}
