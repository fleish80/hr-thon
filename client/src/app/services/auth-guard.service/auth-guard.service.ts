import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap, tap, take, catchError } from 'rxjs/operators';
import { Judge } from '../../models/judge';
import { FirebaseService } from '../firebase.service/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  onAuthStateChanged$: Observable<any>;

  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {
    this.createObs();
  }

  private createObs() {
    this.onAuthStateChanged$ = Observable.create(obs => {
      return this.firebaseService
        .getAuth()
        .onAuthStateChanged(
          user => obs.next(user),
          err => obs.error(err),
          () => obs.complete()
        );
    });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const uid = route.params.uid;
    return this.onAuthStateChanged$.pipe(
      switchMap(user => {
        return this.firebaseService.getJudge(user.uid).pipe(
          map((judge: Judge) => {
            return !!judge && (judge.uid === uid || judge.admin);
          })
        );
      }),
      tap(ans => {
        if (!ans) {
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
