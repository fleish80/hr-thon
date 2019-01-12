import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service/firebase.service';
import { Login } from '../models/login';
import { SnackBarService } from '../services/snack-bar.service/snack-bar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  usernameCtrl: FormControl;
  passwordCtrl: FormControl;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private router: Router,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.usernameCtrl = new FormControl(null, [Validators.required]);
    this.passwordCtrl = new FormControl(null, [Validators.required]);
    this.form = this.fb.group({
      username: this.usernameCtrl,
      password: this.passwordCtrl
    });
  }

  async submit() {
    if (this.form.valid) {
      try {
        this.loading = true;
        const credetionals: firebase.auth.UserCredential = await this.firebaseService.emailLogin(
          <Login>this.form.value
        );
        this.router.navigate(['/judge', credetionals.user.uid]);
      } catch (e) {
        this.snackBarService.openFailure(e.message);
        this.loading = false;
      }
    }
  }
}
