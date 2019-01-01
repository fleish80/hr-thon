import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Login } from './login/login';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private afAuth: AngularFireAuth) { }

  emailLogin(login: Login) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(login.username, login.password);
    // .then(credential => {
    //   // this.notify.update('Welcome back!', 'success');
    //   // return this.updateUserData(credential.user);
    // })
    // .catch(error => this.handleError(error));
  }
}
