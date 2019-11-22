import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeckBuilderService } from './deck-builder.service';
import { HeroAssets } from 'src/app/shared/models/hero-assets.model';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Card } from 'src/app/shared/models/card.model';
import { MatSnackBar } from '@angular/material';
import * as fromApp from 'src/app/store/app.reducer';
import * as BuilderActions from '../../store/builder.actions';

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
  hasFoundNoCards = false;
  manaCosts = [new Mana(0, false), new Mana(1, false), new Mana(2, false), new Mana(3, false), new Mana(4, false),
  new Mana(5, false), new Mana(6, false), new Mana(7, false), new Mana(8, false), new Mana(9, false), new Mana(10, false)];
  classCards: Card[] = [];
  neutralCards: Card[] = [];
  isLoading: boolean;
  searchFilter: string;
  areSearchFiltersApplied = false;
  filteredClassCards: Card[] = [];
  filteredNeutralCards: Card[] = [];
  private deckBuilderSub: Subscription;
  private assembledDeck: Card[] = [];
  private cardSub: Subscription;

  constructor(
    private deckService: DeckBuilderService,
    private store: Store<fromApp.AppState>,
    private fullDeckSnackbar: MatSnackBar) { }

  ngOnInit() {
    this.assets = this.deckService.getHero();
    this.format = localStorage.getItem('selectedFormat');
    this.dispatchDeckBuilderStart();
    this.deckBuilderSub = this.store.select('builder')
      .subscribe(state => {
        if (state.selectedCards.length > 0) {
          this.classCards = state.classCards;
          this.neutralCards = state.neutralCards;
        } else {
          this.classCards = [...state.classCards];
          this.neutralCards = [...state.neutralCards];
          this.isLoading = state.isLoading;
        }
      });

    this.cardSub = this.deckService.selectedCard.subscribe(
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
    if (mana.selected && (typeof this.searchFilter === 'undefined' || this.searchFilter === '')) {
      this.deckService.addManaFilter(mana.cost);
      this.filteredClassCards.push(...this.deckService.builderUtils.filterCardsByManaCost(this.classCards, mana.cost));
      this.filteredClassCards = this.deckService.builderUtils.orderByManaCost(this.filteredClassCards);
      this.filteredNeutralCards.push(...this.deckService.builderUtils.filterCardsByManaCost(this.neutralCards, mana.cost));
      this.filteredNeutralCards = this.deckService.builderUtils.orderByManaCost(this.filteredNeutralCards);
      this.checkFilteredResults();
    } else if (mana.selected && this.searchFilter) {
      this.filteredClassCards = this.deckService.builderUtils.orderByManaCost
        (
          [
            ...this.filteredClassCards,
            ...this.deckService.builderUtils.filterCardsByText(
              this.deckService.builderUtils.filterCardsByManaCost(this.classCards, mana.cost), this.searchFilter)
          ]
        );

      this.filteredNeutralCards = this.deckService.builderUtils.orderByManaCost
        (
          [
            ...this.filteredNeutralCards,
            ...this.deckService.builderUtils.filterCardsByText(
              this.deckService.builderUtils.filterCardsByManaCost(this.neutralCards, mana.cost), this.searchFilter)
          ]
        );
      this.checkFilteredResults();
    } else {
      this.deckService.removeManaFilter(mana.cost);
      if (this.deckService.selectedManaFilters.length > 0) {
        const removedFilterClassCards: { startIndex: number, count: number } =
          this.deckService.builderUtils.removeCardByManaFilter(this.filteredClassCards, mana.cost);
        const removedFilterNeutralCards: { startIndex: number, count: number } =
          this.deckService.builderUtils.removeCardByManaFilter(this.filteredNeutralCards, mana.cost);
        this.filteredClassCards.splice(removedFilterClassCards.startIndex, removedFilterClassCards.count);
        this.filteredNeutralCards.splice(removedFilterNeutralCards.startIndex, removedFilterNeutralCards.count);
      } else if (this.deckService.selectedManaFilters.length === 0 && this.searchFilter) {
        this.filteredClassCards = this.deckService.builderUtils.orderByManaCost(
          this.deckService.builderUtils.filterCardsByText(this.classCards, this.searchFilter)
        );
        this.filteredNeutralCards = this.deckService.builderUtils.orderByManaCost(
          this.deckService.builderUtils.filterCardsByText(this.neutralCards, this.searchFilter)
        );
      } else {
        this.filteredClassCards = [];
        this.filteredNeutralCards = [];
        this.areSearchFiltersApplied = false;
        this.hasFoundNoCards = false;
        this.areClassCardsShown = true;
        this.areNeutralCardsShown = true;
      }
    }
  }

  onSearchPhrase(event: any) {
    this.areSearchFiltersApplied = true;
    this.searchFilter = event.target.value;
    if (this.deckService.selectedManaFilters.length > 0) {
      this.filteredClassCards = this.deckService.builderUtils.orderByManaCost(
        this.deckService.builderUtils.filterCardsByText(this.filteredClassCards, this.searchFilter)
      );

      this.filteredNeutralCards = this.deckService.builderUtils.orderByManaCost(
        this.deckService.builderUtils.filterCardsByText(this.filteredNeutralCards, this.searchFilter)
      );
      this.checkFilteredResults();
    } else {
      this.filteredClassCards = [...this.deckService.builderUtils.orderByManaCost(
        this.deckService.builderUtils.filterCardsByText(this.classCards, this.searchFilter)
      )];

      this.filteredNeutralCards = [...this.deckService.builderUtils.orderByManaCost(
        this.deckService.builderUtils.filterCardsByText(this.neutralCards, this.searchFilter)
      )];
      this.checkFilteredResults();
    }
  }

  onClearSearchFilter() {
    this.filteredClassCards = this.deckService.builderUtils.orderByManaCost(
      this.deckService.builderUtils.removeCardsBySearchPhrase(this.filteredClassCards, this.searchFilter)
    );
    this.filteredNeutralCards = this.deckService.builderUtils.orderByManaCost(
      this.deckService.builderUtils.removeCardsBySearchPhrase(this.filteredNeutralCards, this.searchFilter)
    );
    this.searchFilter = '';
    if (this.filteredClassCards.length === 0 &&
      this.filteredNeutralCards.length === 0 &&
      this.deckService.selectedManaFilters.length === 0) {
      this.areSearchFiltersApplied = false;
      this.hasFoundNoCards = false;
    } else if (this.filteredClassCards.length === 0 &&
      this.filteredNeutralCards.length === 0 &&
      this.deckService.selectedManaFilters.length > 0) {
      this.deckService.selectedManaFilters.forEach(manaFilter => {
        this.filteredClassCards = [...this.filteredClassCards,
        ...this.deckService.builderUtils.orderByManaCost(this.deckService.builderUtils.
          filterCardsByManaCost(this.classCards, manaFilter)
        )];
        this.filteredNeutralCards = [...this.filteredNeutralCards,
        ...this.deckService.builderUtils.orderByManaCost(this.deckService.builderUtils.
          filterCardsByManaCost(this.neutralCards, manaFilter)
        )];
      });
    }
  }

  onAddToDeckAssembler(card: Card) {
    if (this.deckService.isMaxCardCountReached) {
      this.openSnackbar();
    } else {
      const cardIndex = this.deckService.builderUtils.getSelectedCardIndex(card, this.assembledDeck);
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

  getClassCards(): Card[] {
    if (this.areSearchFiltersApplied) {
      return this.filteredClassCards;
    } else {
      return this.classCards;
    }
  }

  getNeutralCards(): Card[] {
    if (this.areSearchFiltersApplied) {
      return this.filteredNeutralCards;
    } else {
      return this.neutralCards;
    }
  }

  private openSnackbar() {
    this.fullDeckSnackbar.open('Your deck is full', 'Dismiss', {
      duration: 3000
    });
  }

  private checkFilteredResults() {
    const classCardsCount = this.filteredClassCards.length;
    const neutralCardsCount = this.filteredNeutralCards.length;

    if (classCardsCount === 0 && neutralCardsCount === 0) {
      this.hasFoundNoCards = true;
    } else if (classCardsCount === 0 && neutralCardsCount > 0) {
      this.areClassCardsShown = false;
      this.areSearchFiltersApplied = true;
    } else if (classCardsCount > 0 && neutralCardsCount > 0) {
      this.areSearchFiltersApplied = true;
    } else {
      this.areNeutralCardsShown = false;
      this.areSearchFiltersApplied = true;
    }
  }

  private dispatchDeckBuilderStart() {
    this.store.dispatch(BuilderActions.deckBuilderStartClassCards());
    this.store.dispatch(BuilderActions.deckBuilderStartNeutralCards());
  }

  ngOnDestroy(): void {
    this.deckService.resetPageCounters();

    this.store.dispatch(BuilderActions.deckBuilderRefresh({
      classCards: this.classCards,
      neutralCards: this.neutralCards,
      selectedCards: this.deckService.selectedCards
    }));

    if (this.deckBuilderSub) {
      this.deckBuilderSub.unsubscribe();
    }
    if (this.cardSub) {
      this.cardSub.unsubscribe();
    }
  }
}
