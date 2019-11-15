import { Card } from '../models/card.model';
export class DeckBuilderUtils {

  getSelectedCardIndex(card: Card, selectedCards: Card[]): number {
    return selectedCards.findIndex((selectedCard) => selectedCard.name === card.name);
  }

  filterCardsByManaCost(cards: Card[], manaFilter: number): Card[] {
    return cards.filter((card) => card.manaCost === manaFilter);
  }

  filterCardsByText(cards: Card[], searchPhrase: string): Card[] {
    const filtered: Card[] = [];
    cards.filter((card: Card) => {
      if (card.text.toLocaleLowerCase().includes(searchPhrase) ||
        card.name.toLocaleLowerCase().includes(searchPhrase) ||
        ('' + card.type).includes(searchPhrase)) {
        filtered.push(card);
      }
    });

    return filtered;
  }

  removeCardByManaFilter(cards: Card[], manaFilter: number): { startIndex: number, count: number } {
    const startIndex = cards.findIndex((card) => card.manaCost === manaFilter);
    let count = 0;

    cards.filter((card) => {
      if (card.manaCost === manaFilter) {
        ++count;
      }
    });

    return { startIndex, count };
  }

  removeCardsBySearchPhrase(cards: Card[], searchPhrase: string) {
    return cards.filter((card) => !card.text.toLocaleLowerCase().includes(searchPhrase) &&
      !card.name.toLocaleLowerCase().includes(searchPhrase) &&
      !('' + card.type).includes(searchPhrase));
  }

  orderByManaCost(cards: Card[]): Card[] {
    return cards.sort((first, second) => first.manaCost - second.manaCost);
  }
}
