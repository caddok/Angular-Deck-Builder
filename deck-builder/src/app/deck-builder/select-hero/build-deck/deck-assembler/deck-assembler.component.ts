import { encode, DeckDefinition } from 'deckstrings';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DeckBuilderService } from '../deck-builder.service';
import { HeroAssets } from 'src/app/shared/models/hero-assets.model';
import { Mana } from '../build-deck.component';
import { Card } from 'src/app/shared/models/card.model';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-deck-assembler',
  templateUrl: './deck-assembler.component.html',
  styleUrls: ['./deck-assembler.component.css']
})
export class DeckAssemblerComponent implements OnInit {

  hero: HeroAssets;
  maxCardCount = 30;
  deckTitle: string;
  isMenuOpen = false;
  currentCardCount = 0;
  manaCurve = [
    new Mana(0, null, 0),
    new Mana(1, null, 0),
    new Mana(2, null, 0),
    new Mana(3, null, 0),
    new Mana(4, null, 0),
    new Mana(5, null, 0),
    new Mana(6, null, 0),
    new Mana(7, null, 0)
  ];
  selectedCards: Card[] = [];
  format: string;
  deck: DeckDefinition = {
    cards: [],
    format: 1,
    heroes: []
  };

  constructor(private deckService: DeckBuilderService, private changeDetector: ChangeDetectorRef, private deckCodeSnackbar: MatSnackBar) { }

  ngOnInit() {
    this.hero = this.deckService.getHero();
    this.deckTitle = localStorage.getItem('selectedFormat') + ' ' + this.hero.hero + ' ' + 'deck';
    this.deckService.selectedCard.subscribe(card => {
      if (this.deckService.builderUtils.getSelectedCardIndex(card, this.selectedCards) === -1) {
        this.selectedCards.push(card);
        this.selectedCards.sort((first, second) => {
          if (first.name < second.name) {
            return -1;
          }
        });
      }
      this.addCostToManaCurve(card.manaCost);
      this.calculateCardCount();
    });
  }

  getFormatIcon() {
    if (localStorage.getItem('selectedFormat') === 'standard') {
      return '../../../../../assets/images/formats/standard_deck_icon_small.png';
    } else {
      return '../../../../../assets/images/formats/wild_icon_small.png';
    }
  }

  onOpenManaCurve() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  changeToggleIcon() {
    if (this.isMenuOpen) {
      return '../../../../../assets/images/mana_curve_toggle_up.png';
    } else {
      return '../../../../../assets/images/mana_curve_toggle_down.png';
    }
  }

  calculateHeight(cardCount: number) {
    const height = (100 / this.maxCardCount) * cardCount;

    return height + '%';
  }

  onRemoveFromDeck(card: Card) {
    --this.currentCardCount;
    if (card.isLegendary) {
      card.count = 0;
      card.isAdded = false;
      this.removeFromDeckAssembler(card);
    }

    if (card.count < card.maxCount) {
      card.count = 0;
      card.isAdded = false;
      this.removeFromDeckAssembler(card);
    } else if (card.count === card.maxCount) {
      --card.count;
    }
    this.calculateCardCount();
  }

  onCopyDeckCode(event: ClipboardEvent) {
    this.selectedCards.forEach((card) => {
      this.deck.cards.push([card.id, card.count]);
    });

    if (localStorage.getItem('selectedFormat') === 'standard') {
      this.deck.format = 2;
    } else {
      this.deck.format = 1;
    }
    const clipboard = event.clipboardData || window['clipboardData'];
    this.deck.heroes.push(this.deckService.getHero().deckStringHeroId);
    const deckString = encode(this.deck);
    console.log(deckString);
    clipboard.setData('text', deckString);
    this.deckCodeSnackbar.open('Deck code copied to clipboard', 'Dismiss', {
      duration: 3000
    });
  }

  private addCostToManaCurve(cost: number) {
    if (cost >= 7) {
      ++this.manaCurve[7].cardCount;
    } else {
      ++this.manaCurve[cost].cardCount;
    }
  }

  private removeFromDeckAssembler(card: Card) {
    const selectedCardIndex = this.deckService.builderUtils.getSelectedCardIndex(card, this.selectedCards);
    this.selectedCards.splice(selectedCardIndex, 1);
    this.changeDetector.detectChanges();
  }

  private calculateCardCount() {
    this.deckService.isMaxCardCountReached = false;
    this.currentCardCount = 0;
    this.selectedCards.forEach(card => {
      this.currentCardCount += card.count;
    });

    if (this.currentCardCount === this.maxCardCount) {
      this.deckService.isMaxCardCountReached = true;
    } else {
      this.deckService.isMaxCardCountReached = false;
    }
  }
}
