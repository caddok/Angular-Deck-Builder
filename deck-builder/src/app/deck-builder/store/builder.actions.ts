import { createAction, props } from '@ngrx/store';
import { Card } from 'src/app/shared/models/card.model';

export const deckBuilderStartClassCards = createAction('[Deck Builder Start] Class Cards');
export const deckBuilderStartNeutralCards = createAction('[Deck Builder Start] Neutral Cards');
export const searchClassCardsSuccess = createAction('[Deck Builder Search] Class Cards Search Success', props<{ cards: Card[] }>());
export const searchClassCardsFail = createAction('[Deck Builder Search Class Cards] Class Cards Search Fail',
  props<{ errorMessage: string }>());
export const searchNeutralCardsSuccess = createAction('[Deck Builder Search Neutral Cards] Neutral Cards Search Success',
  props<{ cards: Card[] }>());
export const searchNeutralCardsFail = createAction('[Deck Builder Search Neutral Cards] Neutral Cards Search Fail',
  props<{ errorMessage: string }>());
export const searchNoResults = createAction('[Deck Builder Search] No Result');
export const resetDeckBuilder = createAction('[Deck Builder Reset] Reset Class Cards',
  props<{ classCards: Card[], neutralCards: Card[] }>());
export const deckBuilderStartFinish = createAction('[Deck Builder Finish] All Cards Downloaded',
  props<{ classCards: Card[], neutralCards: Card[] }>());
export const addToAssembler = createAction('[Deck Builder Assembler] Add to Assembler', props<{ card: Card }>());
export const removeFromAssembler = createAction('[Deck Builder Assembler] Remove from Assembler', props<{ card: Card }>());
