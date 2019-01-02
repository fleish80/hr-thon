import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../firebase.service';
import { Login } from './login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  usernameCtrl: FormControl;
  passwordCtrl: FormControl;

  constructor(private fb: FormBuilder, private firebaseService: FirebaseService) { }

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

  async submit() {
    if (this.form.valid) {
      const credetionals: firebase.auth.UserCredential = await this.firebaseService.emailLogin(<Login>this.form.value);
      console.log('credetionals.user.uid', credetionals.user.uid);
    }

  }

}
