import { SnackBarService } from './snack-bar.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Clause } from './clause';
import { Judge } from './judge';
import { Login } from './login';
import * as firebase from 'firebase';
import { FirebaseAuth } from '@angular/fire';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private snackBarService: SnackBarService) { }

  emailLogin(login: Login) {
    return this.afAuth.auth.signInWithEmailAndPassword(login.username, login.password);
  }

  getAuth(): FirebaseAuth {
    return this.afAuth.auth;
  }

  getJudge(uid: string): Observable<Judge> {
    return this.db.doc<Judge>(`judges/${uid}`).valueChanges().pipe(
      map((judge: Judge) => {
        judge.uid = uid;
        return judge;
      })
    );
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
      ));
  }

  setRating(judge: Judge, project: Project, clauses: Clause[]) {
    for (let clause of clauses) {
      this.db
        .collection('results').doc(judge.uid)
        .collection('projects').doc(project.id.toString())
        .collection('clauses').doc(clause.title).set({
          rating: clause.rating
        });
    };
    if (!judge.hasProjects || !judge.hasProjects.includes(project.id)) {
      if (!judge.hasProjects) {
        judge.hasProjects = [];
      }
      judge.hasProjects.push(project.id);
      this.db.doc(`judges/${judge.uid}`).update({
        hasProjects: judge.hasProjects
      })
    }
  }

  getClausesByJudgeAndProject(judge: Judge, project: Project): Observable<Clause[]> {
    return this.db.collection<Clause>(`results/${judge.uid}/projects/${project.id}/clauses`).snapshotChanges().pipe(
      map((changes: DocumentChangeAction<Clause>[]) => {
        return changes.map((change: DocumentChangeAction<Clause>) => {
          const title = change.payload.doc.id;
          const data = change.payload.doc.data();
          return {
            title,
            ...data
          } as Clause;
        });
      }
      ));
  }
}
