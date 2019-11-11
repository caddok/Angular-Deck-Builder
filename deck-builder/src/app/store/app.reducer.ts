import * as fromAuth from '../auth/store/auth.reducer';
import * as fromBuilder from '../deck-builder/store/builder.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
  auth: fromAuth.State;
  builder: fromBuilder.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.reducer,
  builder: fromBuilder.reducer
};
