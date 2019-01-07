import { Injectable } from "@angular/core";
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from "@angular/router";
import { Observable, of } from 'rxjs';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: "root"
})
export class AuthGuardService implements CanActivate {
  
  constructor(private firebaseService: FirebaseService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const uid = route.params.uid;
    const currentUser: firebase.User = this.firebaseService.getCurrentUser();
    if (currentUser && currentUser.uid === uid) {
      return of(true);
    } else {
      this.router.navigate(['//login']);
      return of (false)
    }
    
}
}
