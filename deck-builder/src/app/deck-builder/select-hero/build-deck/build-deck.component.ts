import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeckBuilderService } from './deck-builder.service';
import { HeroAssets } from 'src/app/shared/models/hero-assets.model';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Card } from 'src/app/shared/models/card.model';
import * as fromApp from 'src/app/store/app.reducer';
import * as BuilderActions from '../../store/builder.actions';
import { MatSnackBar } from '@angular/material';

export class Mana {
  constructor(public cost: number, public selected?: boolean, public cardCount?: number) { }
}

@Component({
  selector: 'app-build-deck',
  templateUrl: './build-deck.component.html',
  styleUrls: ['./build-deck.component.css']
})
export class BuildDeckComponent implements OnInit, OnDestroy {

  selectedHero: string;
  format: string;
  assets: HeroAssets;
  areClassCardsShown = true;
  areNeutralCardsShown = true;
  isDeckAssemblerShown = true;
  manaCosts = [new Mana(0, false), new Mana(1, false), new Mana(2, false), new Mana(3, false), new Mana(4, false),
  new Mana(5, false), new Mana(6, false), new Mana(7, false), new Mana(8, false), new Mana(9, false), new Mana(10, false)];
  classCards: Card[] = [];
  neutralCards: Card[] = [];
  isLoading: boolean;
  searchFilter: string;
  private deckBuilderSub: Subscription;
  private assembledDeck: Card[] = [];

  constructor(private deckService: DeckBuilderService, private store: Store<fromApp.AppState>, private fullDeckSnackbar: MatSnackBar) { }

  ngOnInit() {
    this.assets = this.deckService.getHero();
    this.format = localStorage.getItem('selectedFormat');
    this.store.dispatch(BuilderActions.deckBuilderStartClassCards());
    this.store.dispatch(BuilderActions.deckBuilderStartNeutralCards());

    this.deckBuilderSub = this.store.select('builder')
      .subscribe(result => {
        this.classCards = [...result.classCards];
        this.neutralCards = [...result.neutralCards];
        this.isLoading = result.isLoading;
      });

    this.deckService.selectedCard.subscribe(
      card => {
        if (card.count === 0) {
          this.assembledDeck.splice(this.deckService.builderUtils.getSelectedCardIndex(card, this.assembledDeck), 1);
        } else {
          --card.count;
        }
      }
    );
  }

  onShowClassCards() {
    this.areClassCardsShown = !this.areClassCardsShown;
  }

  onShownNeutralCards() {
    this.areNeutralCardsShown = !this.areNeutralCardsShown;
  }

  onManaCostSelected(mana: Mana) {
    mana.selected = !mana.selected;
    if (mana.selected) {
      this.deckService.removeManaFilter(mana.cost);
    } else {
      this.deckService.addManaFilter(mana.cost);
    }
  }

  onSearchPhrase(event: any) {
    console.log(event.target.value);
  }

  onClearSearchFilter() {
    this.searchFilter = '';
  }

  onAddToDeckAssembler(card: Card) {
    const cardIndex = this.deckService.builderUtils.getSelectedCardIndex(card, this.assembledDeck);

    if (this.deckService.isMaxCardCountReached) {
      this.openSnackbar();
    } else {
      if (cardIndex > -1 && card.maxCount > card.count) {
        ++card.count;
        this.deckService.addCard(card);
      } else if (card.maxCount === card.count) {
        card.count = card.isLegendary ? 1 : 2;
      } else {
        card.count = 1;
        card.maxCount = card.isLegendary ? 1 : 2;
        card.isAdded = true;
        this.assembledDeck.push(card);
        this.deckService.addCard(card);
      }
    }
  }

  private openSnackbar() {
    this.fullDeckSnackbar.open('Your deck is full', 'Dismiss', {
      duration: 3000
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(BuilderActions.resetDeckBuilder({ classCards: this.classCards, neutralCards: this.neutralCards }));
    this.deckService.resetPageCounters();
    if (this.deckBuilderSub) {
      this.deckBuilderSub.unsubscribe();
    }
  }
}
