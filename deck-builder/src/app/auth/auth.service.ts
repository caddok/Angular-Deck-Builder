import { environment } from './../../environments/environment';
import { Registration } from './../shared/models/registration.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthResponseData, AuthEffects } from './store/auth.effects';
import { User } from '../shared/models/user.model';
import { Store } from '@ngrx/store';
import * as AuthActions from './store/auth.actions';
import * as fromApp from '../store/app.reducer';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private store: Store<fromApp.AppState>) { }

  registerUser(registration: Registration) {
    return this.http.post<AuthResponseData>(
      'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' + environment.firebaseApiKey,
      {
        email: registration.email,
        password: registration.password,
        returnSecureToken: true
      }
    );
  }

  saveUser(user: User) {
    return this.http.put(
      'https://deck-builder-ede8e.firebaseio.com/users.json',
      user
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' + environment.firebaseApiKey,
      {
        email,
        password,
        returnSecureToken: true
      }
    );
  }

  setLogoutTimer(timeLeft: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(AuthActions.logout());
    }, timeLeft);
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }
}
