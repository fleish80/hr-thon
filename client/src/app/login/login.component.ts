import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  usernameCtrl: FormControl;
  passwordCtrl: FormControl;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.usernameCtrl = new FormControl(null, [Validators.required]);
    this.passwordCtrl = new FormControl(null, [Validators.required]);
    this.form = this.fb.group({
      username: this.usernameCtrl,
      password: this.passwordCtrl
    }) 
  };

}
