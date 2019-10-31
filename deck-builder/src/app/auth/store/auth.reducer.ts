import { Registration } from 'src/app/shared/models/registration.model';
import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { User } from 'src/app/shared/models/user.model';

export interface State {
  registration: Registration;
  authError: string;
  loading: boolean;
  user: User;
}

const initialState = {
  registration: null,
  authError: null,
  loading: false,
  user: null
};

export const reducer = createReducer(
  initialState,
  on(AuthActions.registrationStart, state => ({
    ...state,
    authError: null,
    loading: true
  })),
  on(AuthActions.authFail, (state, action) => ({
    ...state,
    authError: action.message,
    loading: false
  })),
  on(AuthActions.authSuccess, (state, action) => ({
    ...state,
    authError: null,
    loading: false,
    user: action.user
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
    authError: null,
    loading: false,
    user: null
  })),
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
  }))
);
