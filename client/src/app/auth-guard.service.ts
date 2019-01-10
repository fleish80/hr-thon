import { catchError, tap, map, switchMap } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from "@angular/router";
import { Observable, of } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { Judge } from './judge';

@Injectable({
  providedIn: "root"
})
export class AuthGuardService implements CanActivate {


  onAuthStateChanged$: Observable<any>;

  constructor(private firebaseService: FirebaseService, private router: Router) {
    this.createObs();
  }

  private createObs() {
    this.onAuthStateChanged$ = Observable.create(obs => {
      return this.firebaseService.getAuth().onAuthStateChanged(
        user => obs.next(user),
        err => obs.error(err),
        () => obs.complete());
    })
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const uid = route.params.uid;
    return this.onAuthStateChanged$.pipe(
      switchMap(user => {
        return this.firebaseService.getJudge(user.uid).pipe(
          map((judge: Judge) => {
            return !!judge && (judge.uid === uid || judge.admin);
          }))
      }),
      tap(ans => {
        if (!ans) { this.router.navigate(['/login']); }
      })
    )
  }
}
