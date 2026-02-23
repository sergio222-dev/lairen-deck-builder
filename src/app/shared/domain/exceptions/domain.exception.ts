export abstract class DomainException {
  get message() {
    return this._message;
  }

  protected constructor(private readonly _message: string) {
  }

  abstract toString(): string;
}
