import { Card } from '../models/card.model';
export class DeckBuilderUtils {

  getSelectedCardIndex(card: Card, selectedCards: Card[]): number {
    return selectedCards.findIndex((selectedCard) => selectedCard.name === card.name);
  }
}
