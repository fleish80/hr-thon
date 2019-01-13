import { Judge } from './../../models/judge';
import { FirebaseService } from './../firebase.service/firebase.service';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { switchMap, map, tap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminResolverService implements Resolve<any> {
  onAuthStateChanged$: Observable<any>;

  constructor(private firebaseService: FirebaseService) {
  }

  private createObs() {
    this.onAuthStateChanged$ = Observable.create(obs => {
      return this.firebaseService.getAuth().onAuthStateChanged(
        user => {
          obs.next(user);
          obs.complete();
        },
        err => obs.error(err)
        // () => obs.complete()
      );
    });
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const user: firebase.User = this.firebaseService.getAuth().currentUser;
    return this.firebaseService.getJudge(user.uid).pipe(
      map((judge: Judge) => judge.admin),
      take(1)
    );
  }
}
