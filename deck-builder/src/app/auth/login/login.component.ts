import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import * as AuthActions from '../store/auth.actions';
import * as fromApp from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  isLoading = false;
  isPasswordHidden = true;
  loginForm: FormGroup;
  private loginSub: Subscription;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
    this.loginSub = this.store.select('auth')
      .subscribe(response => this.isLoading = response.loading);
  }

  getErrorMessage() {
    return this.loginForm.controls.email.hasError('required') ? 'You must enter a value' :
      this.loginForm.controls.email.hasError('email') ? 'Not a valid email' : '';
  }

  onSubmit() {
    console.log(this.loginForm);
    this.store.dispatch(AuthActions.login({
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value
    }));
  }

  ngOnDestroy(): void {
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
  }
}
