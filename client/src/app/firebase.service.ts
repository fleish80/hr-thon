import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Login } from './login/login';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) { }

  emailLogin(login: Login) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(login.username, login.password);
  }

  currentUser() {
    this.afAuth.auth.currentUser
  }

  getClauses(): Observable<any> {
    return this.db.collection('Clause').valueChanges()
  }

  getProjects(): Observable<any> {
    return this.db.collection('Project').valueChanges()
  }

  getJudge(uid: string) {
    return this.db.doc(`Judge/${uid}`).valueChanges();
  }
}
