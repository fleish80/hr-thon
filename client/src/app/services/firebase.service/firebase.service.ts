import { Injectable } from '@angular/core';
import { FirebaseAuth } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/firestore';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Clause } from '../../models/clause';
import { Judge } from '../../models/judge';
import { Login } from '../../models/login';
import { SnackBarService } from '../snack-bar.service/snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private snackBarService: SnackBarService
  ) { }

  emailLogin(login: Login) {
    return this.afAuth.auth.signInWithEmailAndPassword(
      login.username,
      login.password
    );
  }

  getAuth(): FirebaseAuth {
    return this.afAuth.auth;
  }

  getJudge(uid: string): Observable<Judge> {
    return this.db
      .doc<Judge>(`judges/${uid}`)
      .valueChanges()
      .pipe(
        map((judge: Judge) => {
          judge.uid = uid;
          return judge;
        })
      );
  }

  getJudges(): Observable<Judge[]> {
    return this.db
      .collection<Judge>('judges', ref => ref)
      .snapshotChanges()
      .pipe(
        map((changes: DocumentChangeAction<Judge>[]) => {
          return changes.map((change: DocumentChangeAction<Judge>) => {
            const uid = change.payload.doc.id;
            const data = change.payload.doc.data();
            return { uid, ...data } as Judge;
          });
        }),
        map((judges:  Judge[]) => judges.filter((judge: Judge) => !judge.admin && !judge.hidden))
      );
  }

  getProjects(): Observable<Project[]> {
    return this.db
      .collection<Project>('projects')
      .snapshotChanges()
      .pipe(
        map((changes: DocumentChangeAction<Project>[]) => {
          return changes.map((change: DocumentChangeAction<Project>) => {
            const id = +change.payload.doc.id;
            const data = change.payload.doc.data();
            return { id, ...data } as Project;
          });
        }),
        map((projects: Project[]) => projects.filter((project: Project) => !project.hidden)),
        map((projects: Project[]) => projects.sort((p1: Project, p2: Project) => {
          return p1.id - p2.id;
        }))
      );
  }

  getProjectRating(judge: Judge, project: Project): Observable<number> {
    return this.db
      .collection('projects-average').doc(project.id.toString())
      .collection('judges').doc(judge.uid).valueChanges()
      .pipe(
        map((p: Project) => p && p.average)
      );
  }

  getClauses(): Observable<Clause[]> {
    return this.db
      .collection<Clause>('clauses')
      .snapshotChanges()
      .pipe(
        map((changes: DocumentChangeAction<Clause>[]) => {
          return changes.map((change: DocumentChangeAction<Clause>) => {
            const title = change.payload.doc.id;
            const data = change.payload.doc.data();
            return { title, ...data } as Clause;
          });
        })
      );
  }

  setRating(judge: Judge, project: Project, clauses: Clause[]): Promise<any> {
    const projectTotal: Clause = clauses.reduce(
      (acc: Clause, clause: Clause) => {
        return { rating: acc.rating + clause.rating * clause.percent };
      },
      { rating: 0 }
    );
    const projectAvg: number = projectTotal.rating / 100;
    return Promise.all(
      clauses.map((clause: Clause) => {
        return this.db
          .collection('results')
          .doc(judge.uid)
          .collection('projects')
          .doc(project.id.toString())
          .collection('clauses')
          .doc(clause.title)
          .set({
            rating: clause.rating,
            percent: clause.percent,
            desc: clause.desc
          });
      })
    );
  }

  updateHasProject(judge: Judge, project: Project): Promise<any> {
    let promise: Promise<any> = null;
    if (!judge.hasProjects || !judge.hasProjects.includes(project.id)) {
      if (!judge.hasProjects) {
        judge.hasProjects = [];
      }
      judge.hasProjects.push(project.id);
      promise = this.db.doc(`judges/${judge.uid}`).update({
        hasProjects: judge.hasProjects
      });
    }
    return promise;
  }

  setProjectAvg(
    judge: Judge,
    project: Project,
    clauses: Clause[]
  ): Promise<any> {
    const projectTotal: Clause = clauses.reduce(
      (acc: Clause, clause: Clause) => {
        return { rating: acc.rating + clause.rating * clause.percent };
      },
      { rating: 0 }
    );
    const projectAvg: number = projectTotal.rating / 100;
    project.average = projectAvg;
    return this.db
      .collection('projects-average')
      .doc(project.id.toString())
      .collection('judges')
      .doc(judge.uid)
      .set({
        average: projectAvg
      });
  }

  setSummary(project: Project): Observable<Promise<any>> {
    const collection: AngularFirestoreCollection = this.db
      .collection('projects-average')
      .doc(project.id.toString())
      .collection('judges');
    return this.getJudges().pipe(
      switchMap((judges: Judge[]) => {
        return combineLatest(
          judges.map((judge: Judge) => {
            return collection
              .doc(judge.uid)
              .valueChanges()
              .pipe(map((p: Project) => p && p.average));
          })
        );
      }),
      map((averages: number[]) =>
        averages.filter((average: number) => !!average)
      ),
      map((averages: number[]) => {
        let summary = 0;
        if (averages && averages.length > 0) {
          summary =
            averages.reduce((acc: number, curr: number) => acc + curr, 0) /
            averages.length;
        }
        return this.db
          .collection('projects')
          .doc(project.id.toString())
          .update({ summary: summary });
      })
    );
  }

  getClausesByJudgeAndProject(
    judge: Judge,
    project: Project
  ): Observable<Clause[]> {
    return this.db
      .collection('results')
      .doc(judge.uid)
      .collection('projects')
      .doc(project.id.toString())
      .collection('clauses')
      .snapshotChanges()
      .pipe(
        map((changes: DocumentChangeAction<Clause>[]) => {
          return changes.map((change: DocumentChangeAction<Clause>) => {
            const title = change.payload.doc.id;
            const data = change.payload.doc.data();
            return {
              title,
              ...data
            } as Clause;
          });
        })
      );
  }
}
