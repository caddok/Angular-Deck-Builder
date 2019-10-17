import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import * as SignupActions from './auth.actions';
import { User } from 'src/app/shared/models/user.model';
import { Registration } from 'src/app/shared/models/registration.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string, registration: Registration) => {
  const expirationDate = new Date(new Date().getTime() + (expiresIn * 1000));
  const user = new User(email, userId, token, expirationDate, registration.secretQuestion, registration.secretAnswer);
  localStorage.setItem('userData', JSON.stringify(user));
  return SignupActions.registrationSuccess({ user, redirect: true });
};

const handleError = (errorResponse: HttpErrorResponse) => {
  let errorMessage = 'An error has ocurred';

  if (!errorResponse.error || !errorResponse.error.error) {
    return of(
      SignupActions.registrationFail({ message: errorMessage })
    );
  }

  switch (errorResponse.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email is already in use';
      break;
  }

  return of(
    SignupActions.registrationFail({ message: errorMessage })
  );
};

@Injectable()
export class AuthEffects {

  @Effect()
  signup$ = this.actions$.pipe(
    ofType(SignupActions.registrationStart),
    switchMap(action => {
      return this.authService.registerUser(action.registration)
        .pipe(
          tap((authData) => {
            this.authService.setLogoutTimer(+authData.expiresIn);
          }),
          map(
            authData => {
              return handleAuthentication(+authData.expiresIn, authData.email, authData.localId, authData.idToken, action.registration);
            }),
          catchError(error => handleError(error))
        );
    })
  );

  @Effect({
    dispatch: false
  })
  signupSuccess$ = this.actions$.pipe(
    ofType(SignupActions.registrationSuccess),
    tap(action => {
      if (action.redirect) {
        this.router.navigate(['/']);
      }
    }),
    switchMap(action => this.authService.saveUser(action.user))
  );

  @Effect()
  autoLogin$ = this.actions$.pipe(
    ofType(SignupActions.autoLogin),
    map(() => {
      const user: User = JSON.parse(localStorage.getItem('userData'));
      if (user.token) {
        const expirationDuration = new Date(user.tokenExpirationDate).getTime() - new Date().getTime();
        this.authService.setLogoutTimer(expirationDuration);
        return SignupActions.registrationSuccess({ user, redirect: false });
      }

      return { type: 'DUMMY' };
    })
  );

  @Effect({
    dispatch: false
  })
  logout = this.actions$.pipe(
    ofType(SignupActions.logout),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
    })
  );

  constructor(private actions$: Actions, private authService: AuthService, private router: Router) { }
}
