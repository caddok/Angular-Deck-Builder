import { createAction, props } from '@ngrx/store';
import { Card } from 'src/app/shared/models/card.model';

export const deckBuilderStartClassCards = createAction('[Deck Builder Start] Class Cards');
export const deckBuilderStartNeutralCards = createAction('[Deck Builder Start] Neutral Cards');
export const resetDeckBuilder = createAction('[Deck Builder Reset] Reset Class Cards',
  props<{ classCards: Card[], neutralCards: Card[] }>());
export const deckBuilderStartFinish = createAction('[Deck Builder Finish] All Cards Downloaded',
  props<{ classCards: Card[], neutralCards: Card[] }>());
export const deckBuilderRefresh = createAction('[Deck Builder Refresh] Deck Builder Refresh',
  props<{ classCards: Card[], neutralCards: Card[], selectedCards: Card[] }>());
