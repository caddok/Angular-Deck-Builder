import { createReducer, on } from '@ngrx/store';
import * as BuilderActions from './builder.actions';
import { Card } from 'src/app/shared/models/card.model';

export interface BuilderState {
  isLoading: boolean;
  error: string;
  classCards: Card[];
  neutralCards: Card[];
  selectedCards: Card[];
  selectedCard: Card;
}

const initialState: BuilderState = {
  isLoading: false,
  error: null,
  classCards: [],
  neutralCards: [],
  selectedCard: null,
  selectedCards: []
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
  on(BuilderActions.deckBuilderRefresh, (state, action) => ({
    ...state,
    classCards: action.classCards,
    neutralCards: action.neutralCards,
    selectedCards: action.selectedCards
  }))
);
