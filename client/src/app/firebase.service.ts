import { Injectable } from "@angular/core";
import { FirebaseAuth } from "@angular/fire";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  DocumentChangeAction,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map, take, takeLast } from "rxjs/operators";
import { Clause } from "./clause";
import { Judge } from "./judge";
import { Login } from "./login";
import { SnackBarService } from "./snack-bar.service";

@Injectable({
  providedIn: "root"
})
export class FirebaseService {
  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private snackBarService: SnackBarService
  ) {}

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

  getProjects(): Observable<Project[]> {
    return this.db
      .collection<Project>("projects")
      .snapshotChanges()
      .pipe(
        map((changes: DocumentChangeAction<Project>[]) => {
          return changes.map((change: DocumentChangeAction<Project>) => {
            const id = +change.payload.doc.id;
            const data = change.payload.doc.data();
            return { id, ...data } as Project;
          });
        })
      );
  }

  getClauses(): Observable<Clause[]> {
    return this.db
      .collection<Clause>("clauses")
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
          .collection("results")
          .doc(judge.uid)
          .collection("projects")
          .doc(project.id.toString())
          .collection("clauses")
          .doc(clause.title)
          .set({
            rating: clause.rating,
            percent: clause.percent
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
    return this.db
      .collection("projects-average")
      .doc(judge.uid)
      .collection("projects")
      .doc(project.id.toString())
      .set({
        average: projectAvg
      });
  }

  getClausesByJudgeAndProject(
    judge: Judge,
    project: Project
  ): Observable<Clause[]> {
    return this.db
      .collection("results")
      .doc(judge.uid)
      .collection("projects")
      .doc(project.id.toString())
      .collection("clauses")
      .auditTrail()
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
