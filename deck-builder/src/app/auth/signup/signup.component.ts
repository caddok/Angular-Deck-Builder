import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromApp from '../../store/app.reducer';
import * as SignupActions from '../store/auth.actions';
import { Registration } from 'src/app/shared/models/registration.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  isLoading = false;
  singupForm: FormGroup;
  secretQuestions = [
    'What was the first car you owned',
    'What was the street you lived on in high school',
    'Where was the first place you flew',
    'What was the first video game you beat',
    'What was the name your first pet'
  ];
  passwordRequirements = [
    'Password must have at least 8 characters',
    'Use at least one number and one alphabetic character'
  ];
  passwordRegex = '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$';
  private storeSub: Subscription;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.singupForm = new FormGroup({
      personalData: new FormGroup({
        firstName: new FormControl(null),
        lastName: new FormControl(null),
        date: new FormControl(null, [Validators.required])
      }),
      accountData: new FormGroup({
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [Validators.required,
        Validators.pattern(this.passwordRegex)]),
        secretQuestion: new FormControl(null, [Validators.required]),
        secretAnswer: new FormControl(null, [Validators.required])
      })
    });
    this.storeSub = this.store.select('auth').subscribe(
      signupState => {
        this.isLoading = signupState.loading;
      }
    );
  }

  onRegister() {
    const reg = new Registration(
      this.singupForm.get('personalData.date').value,
      this.singupForm.get('accountData.email').value,
      this.singupForm.get('accountData.password').value,
      this.singupForm.get('accountData.secretQuestion').value,
      this.singupForm.get('accountData.secretAnswer').value,
      this.singupForm.get('personalData.firstName').value,
      this.singupForm.get('personalData.lastName').value
    );
    console.log(reg);
    this.store.dispatch(SignupActions.registrationStart({ registration: reg }));
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }
}
