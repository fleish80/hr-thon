import { Subscriber } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { Judge } from '../models/judge';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  usernameCtrl: FormControl;
  passwordCtrl: FormControl;
  subscriber = new Subscriber();
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

  ngOnDestroy(): void {
    this.subscriber.unsubscribe();
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
        const uid: string = credetionals.user.uid;
        this.subscriber.add(
          this.firebaseService.getJudge(uid).subscribe(
            (judge: Judge) => {
              if (judge.admin) {
                this.router.navigate(['/admin']);
              } else {
                this.router.navigate(['/judge', uid]);
              }
              this.loading = false;
            },
            (error: any) => {
              console.error(error);
              this.snackBarService.openFailure();
              this.loading = false;
            }
          )
        );
      } catch (e) {
        this.snackBarService.openFailure(e.message);
        this.loading = false;
      }
    }
  }
}
