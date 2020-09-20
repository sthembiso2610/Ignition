import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { StateModel } from 'src/app/state/app.state';
import { DbService } from '../db.service';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class SetupGuard implements CanActivate {

  constructor(private store:Store,private db:DbService, private auth:AuthService, private router:Router){} 

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.user$.pipe(
      switchMap(usr=>{
        console.log('usr data', usr);
        return this.db.company$(usr.companyID).pipe(
          take(1),
          map(comp=>{
            console.log('comp data', comp.payload.data())
            return comp.payload.data().setup
          }),
          tap(setup => {
            if (!setup) {
              this.router.navigate(['dashboard/setup']);
            }
          })
        )
      })
    )
  }
  
}