export class DeckNotOwnedByTheUserException extends Error {
  static readonly nameBase = 'DeckNotOwnedByTheUserException';

  constructor() {
    super('Deck is not owned by the user');
    this.name = DeckNotOwnedByTheUserException.nameBase;
  }
}
