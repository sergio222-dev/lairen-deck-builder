export class DeckNotFoundException extends Error {
  static readonly nameBase = 'DeckNotFoundException';
  static readonly code = 404;

  constructor(message?: string) {
    super(message);
    this.name = DeckNotFoundException.nameBase;
  }
}
