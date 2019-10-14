import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoading = false;
  isPasswordHidden = true;
  loginForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  getErrorMessage() {
    return this.loginForm.controls.email.hasError('required') ? 'You must enter a value' :
      this.loginForm.controls.email.hasError('email') ? 'Not a valid email' : '';
  }

  onSubmit() {

  }
}
