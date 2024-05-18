export class UnauthorizedException extends Error {
  static readonly code = 401;
  static readonly nameBase = 'UnauthorizedException';

  constructor(message: string) {
    super(message);
    this.name = UnauthorizedException.nameBase;
  }
}
