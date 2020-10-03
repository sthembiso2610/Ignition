import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { firestore, auth } from 'firebase';
import { take, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthNegGuard implements CanActivate {

  constructor(private router:Router, private auth:AuthService){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.auth.user$.pipe(
        take(1),
        map(user => !user), // <-- map to boolean
        tap(async loggedIn => {
          if (!loggedIn) {
            const usr = await firestore()
              .doc(`AllUsers/${auth().currentUser.uid}`)
              .get();
            if (usr.data().isClient === 0) {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/dashboard']);
            }
          }
        })
      );
  }

}
