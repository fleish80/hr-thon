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
      .signInAndRetrieveDataWithEmailAndPassword(login.username, login.password);
  }

  currentUser() {
    this.afAuth.auth.currentUser
  }
}
