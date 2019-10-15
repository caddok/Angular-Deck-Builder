import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

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

  constructor() { }

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
  }

  onRegister() {
    console.log(this.singupForm);
  }
}
