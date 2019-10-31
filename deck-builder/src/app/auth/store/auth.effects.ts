import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/shared/models/user.model';
import { Registration } from 'src/app/shared/models/registration.model';
import { Router } from '@angular/router';
import * as AuthActions from './auth.actions';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleError = (errorResponse: HttpErrorResponse) => {
  let errorMessage = 'An error ocurred';

  if (!errorResponse.error || !errorResponse.error.error) {
    return of(
      AuthActions.authFail({ message: errorMessage })
    );
  }

  switch (errorResponse.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email is already in use';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'This email doesn\'t exists';
      break;
  }

  return of(
    AuthActions.authFail({ message: errorMessage })
  );
};

@Injectable()
export class AuthEffects {

  @Effect()
  signup$ = this.actions$.pipe(
    ofType(AuthActions.registrationStart),
    switchMap(action => {
      return this.authService.registerUser(action.registration)
        .pipe(
          map(
            authData => {
              return this.handleAuthentication(
                +authData.expiresIn,
                authData.email,
                authData.localId,
                authData.idToken,
                action.registration);
            }),
          catchError(error => handleError(error))
        );
    })
  );

  @Effect()
  autoLogin$ = this.actions$.pipe(
    ofType(AuthActions.autoLogin),
    map(() => {
      const user: User = JSON.parse(localStorage.getItem('userData'));
      if (user.token) {
        const expirationDuration = new Date(user.tokenExpirationDate).getTime() - new Date().getTime();
        this.authService.setLogoutTimer(expirationDuration);
        return AuthActions.authSuccess({ user, redirect: false });
      }

      return { type: 'DUMMY' };
    })
  );

  @Effect({
    dispatch: false
  })
  logout = this.actions$.pipe(
    ofType(AuthActions.logout),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
    })
  );

  @Effect()
  login$ = this.actions$.pipe(
    ofType(AuthActions.login),
    switchMap((authData) =>
      this.authService.login(authData.email, authData.password)
        .pipe(
          map(response => this.handleAuthentication(+response.expiresIn, response.email, response.localId, response.idToken)),
          catchError(error => handleError(error))
        )
    )
  );

  @Effect({
    dispatch: false
  })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.authSuccess),
    tap((success) => {
      if (success.redirect) {
        this.router.navigate(['/']);
      }
    })
  );

  constructor(private actions$: Actions, private authService: AuthService, private router: Router) { }

  private handleAuthentication(expiresIn: number, email: string, userId: string, token: string, registration?: Registration) {
    const expireInMillis = expiresIn * 1000;
    const expirationDate = new Date(new Date().getTime() + expireInMillis);
    this.authService.setLogoutTimer(expireInMillis);
    let user: User;
    if (registration) {
      user = new User(email, userId, token, expirationDate, registration.secretQuestion, registration.secretAnswer);
    } else {
      user = new User(email, userId, token, expirationDate);
    }

    localStorage.setItem('userData', JSON.stringify(user));
    return AuthActions.authSuccess({ user, redirect: true });
  }
}
