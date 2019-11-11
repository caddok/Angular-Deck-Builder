import { createReducer, on } from '@ngrx/store';
import * as BuilderActions from './builder.actions';
import { Card } from 'src/app/shared/models/card.model';

export interface State {
  isLoading: boolean;
  error: string;
  classCards: Card[];
  neutralCards: Card[];
  selectedCard: Card;
}

const initialState: State = {
  isLoading: false,
  error: null,
  classCards: [],
  neutralCards: [],
  selectedCard: null
};

export const reducer = createReducer(
  initialState,
  on(BuilderActions.deckBuilderStartClassCards, (state) => ({
    ...state,
    isLoading: true
  })),
  on(BuilderActions.deckBuilderStartNeutralCards, (state) => ({
    ...state,
    isLoading: true
  })),
  on(BuilderActions.searchClassCardsSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    classCards: [...action.cards]
  })),
  on(BuilderActions.searchClassCardsFail, (state, action) => ({
    ...state,
    isLoading: false,
    classCards: []
  })),
  on(BuilderActions.searchNeutralCardsSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    neutralCards: [...action.cards]
  })),
  on(BuilderActions.searchNeutralCardsFail, (state, action) => ({
    ...state,
    isLoading: false,
    neutralCards: []
  })),
  on(BuilderActions.searchNoResults, state => ({
    ...state,
    isLoading: false,
    error: 'Not found'
  })),
  on(BuilderActions.resetDeckBuilder, (state, action) => ({
    ...state,
    classCards: action.classCards,
    neutralCards: action.neutralCards
  })),
  on(BuilderActions.deckBuilderStartFinish, (state, action) => ({
    ...state,
    classCards: action.classCards,
    neutralCards: action.neutralCards,
    isLoading: false
  })),
  on(BuilderActions.addToAssembler, (state, action) => ({
    ...state,
    selectedCard: action.card
  }))
);
