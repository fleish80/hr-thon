import { catchError, tap, map } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from "@angular/router";
import { Observable, of } from 'rxjs';
import { FirebaseService } from './firebase.service';

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
      map(user => { return !!user && user.uid === uid; }),
      tap(ans => {
        if (!ans) { this.router.navigate(['/login']); }
      })
    )
  }
}
