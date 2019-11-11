import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { DeckBuilderService, CardSearchResponse } from '../select-hero/build-deck/deck-builder.service';
import { Card } from 'src/app/shared/models/card.model';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import * as BuilderActions from './builder.actions';
import * as fromBuilder from './builder.reducer';

@Injectable()
export class BuilderEffects {

  private classCardsPageCount: number;
  private neutralCardsPageCount: number;
  private classCards: Card[] = [];
  private neutralCards: Card[] = [];
  private classCardsCurrentPage = 0;
  private neutralCardsCurrentPage = 0;

  @Effect({
    resubscribeOnError: true
  })
  deckBuilderClassStart$ = this.$actions.pipe(
    ofType(BuilderActions.deckBuilderStartClassCards),
    switchMap(() => {
      return this.deckService.getClassCards()
        .pipe(
          map((response: CardSearchResponse) => this.onClassCardsSearchResult(response)),
          catchError((response) => of(BuilderActions.searchClassCardsFail({ errorMessage: response.message })))
        );
    })
  );

  @Effect({
    resubscribeOnError: true
  })
  deckBuilderNeutralStart$ = this.$actions.pipe(
    ofType(BuilderActions.deckBuilderStartNeutralCards),
    switchMap(() => this.deckService.getNeutralCards().pipe(
      map((response: CardSearchResponse) => this.onNeutralCardsSearchResult(response)),
      catchError((error: HttpErrorResponse) => of(BuilderActions.searchNeutralCardsFail({ errorMessage: error.message })))
    ))
  );

  @Effect()
  deckBuilderReset = this.$actions.pipe(
    ofType(BuilderActions.resetDeckBuilder),
    map((action) => {
      this.reset();
      action.classCards = [];
      action.neutralCards = [];

      return { type: 'RESET' };
    })
  );

  constructor(private $actions: Actions, private deckService: DeckBuilderService, private store: Store<fromBuilder.State>) { }

  private onClassCardsSearchResult(response: CardSearchResponse) {
    this.classCardsCurrentPage++;
    this.classCardsPageCount = response.pageCount;
    this.classCards = [...this.classCards, ...this.mapToCardModel(response)];

    if (this.checkPagesCounter()) {
      return BuilderActions.deckBuilderStartFinish({ classCards: this.classCards, neutralCards: this.neutralCards });
    } else {
      return BuilderActions.deckBuilderStartClassCards();
    }
  }

  private onNeutralCardsSearchResult(response: CardSearchResponse) {
    this.neutralCardsCurrentPage++;
    this.neutralCardsPageCount = response.pageCount;
    this.neutralCards = [...this.neutralCards, ...this.mapToCardModel(response)];

    if (this.checkPagesCounter()) {
      return BuilderActions.deckBuilderStartFinish({ classCards: this.classCards, neutralCards: this.neutralCards });
    } else {
      return BuilderActions.deckBuilderStartNeutralCards();
    }
  }

  private mapToCardModel(response: CardSearchResponse): Card[] {
    return response.cards.map(cardResponse => {
      return new Card(cardResponse.manaCost,
        cardResponse.name.en_US,
        cardResponse.image.en_US,
        cardResponse.cropImage,
        cardResponse.rarityId === 5 ? true : false,
        0, cardResponse.rarityId === 5 ? 1 : 2,
        false);
    });
  }

  private checkPagesCounter(): boolean {
    if (this.classCardsCurrentPage >= this.classCardsPageCount && this.neutralCardsCurrentPage >= this.neutralCardsPageCount) {
      return true;
    }

    return false;
  }

  private reset() {
    this.classCards = [];
    this.neutralCards = [];
    this.classCardsPageCount = 0;
    this.neutralCardsPageCount = 0;
    this.classCardsCurrentPage = 0;
    this.neutralCardsCurrentPage = 0;
  }
}
