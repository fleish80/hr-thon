import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Login } from './login/login';
import { Judge } from './judge';
import { map, tap } from 'rxjs/operators';
import { Clause } from './clause';

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

  getJudge(uid: string): Observable<Judge> {
    return this.db.doc<Judge>(`judges/${uid}`).valueChanges();
  }

  getProjects(): Observable<Project[]> {
    return this.db.collection<Project>('projects').snapshotChanges().pipe(
      map((changes: DocumentChangeAction<Project>[]) => {
        return changes.map((change: DocumentChangeAction<Project>) => {
          const id = +change.payload.doc.id;
          const data = change.payload.doc.data();
          return { id, ...data } as Project;
        });
      }
      ));
  }

  getClauses(): Observable<Clause[]> {
    return this.db.collection<Clause>('clauses').snapshotChanges().pipe(
      map((changes: DocumentChangeAction<Clause>[]) => {
        return changes.map((change: DocumentChangeAction<Clause>) => {
          const title = change.payload.doc.id;
          return { title } as Clause;
        });
      }
      ),
      tap(data => console.log(data)));
  }
}
