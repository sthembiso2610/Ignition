import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { take, map, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class EmpGuard implements CanActivate {
	constructor(private router: Router, private auth: AuthService) {}
	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		return this.auth.user$.pipe(
			take(1),
			map((usr) => {
				console.log('user data', usr);
				return usr.userType == 1;
			}),
			tap((isEmp) => {
				console.log('outcome', isEmp);
				if (!isEmp) {
					this.router.navigate([ 'dashboard/home-c' ]);
				}
			})
		);
	}
}
