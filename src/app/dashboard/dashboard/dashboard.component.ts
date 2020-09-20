import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { NbMenuItem, NbSidebarService, NbMenuService, NB_WINDOW } from '@nebular/theme';
import { filter, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Select, Store } from '@ngxs/store';
import { AppState } from 'src/app/state/app.state';
import { Observable, Subscription } from 'rxjs';
import { IGNUser } from 'src/app/models/user.model';
import { Company } from 'src/app/models/company.model';
import { AppInfo } from 'src/app/models';
import { EmployeeType } from 'src/app/models/employeeType.model';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: [ './dashboard.component.scss' ]
})
export class DashboardComponent implements OnInit, OnDestroy {
	showSideBar: boolean = true;
	@Select(AppState.company) company$: Observable<Company>;
	@Select(AppState.appInfo) appInfo$: Observable<AppInfo>;
	init: boolean = false;
	companyInit: boolean = false;
	unsubscribe: Subscription[] = [];

	items: NbMenuItem[] = [
		{
			title: 'Home',
			icon: 'home',
			home: true,
			link: '/dashboard/home'
		},
		{
			title: 'Calendar',
			icon: 'calendar',
			home: true,
			link: '/dashboard/calendar'
		}
	];

	headerMenuItems = [
		{
			title: 'Profile'
		},
		{
			title: 'Logout'
		}
	];
	@Select(AppState.user) user$: Observable<IGNUser>;

	toggleSideBar() {
		this.showSideBar = !this.showSideBar;
		this.sideBarService.toggle(this.showSideBar);
	}

	constructor(
		private sideBarService: NbSidebarService,
		private auth: AuthService,
		private store: Store,
		private router: Router,
		private nbMenuService: NbMenuService,
		@Inject(NB_WINDOW) private window
	) {
		const sub = this.company$.subscribe((comp) => {
			if (comp.name != '' && !this.init) {
				this.init = true;
				const user: IGNUser = this.store.snapshot().app.user;
				let index = comp.empTypes.findIndex((e) => e.id == user.empType);
				let empType: EmployeeType = index == -1 ? {} : comp.empTypes[index];
				if (user.userType == 0) {
          console.log('emp type', empType);

					if (empType.role == 2) {
						// admin
						this.items.push(
							...[
								{
									title: 'Clients',
									icon: 'people',
									children: [
										{
											title: 'All clients',
											icon: 'people',
											link: '/dashboard/clients/all',
											home: true
										},
										{
											title: 'Invite client',
											icon: 'person-add',
											link: '/dashboard/clients/new',
											home: true
										}
									]
								},
								{
									title: 'Reports',
									icon: 'bar-chart-2',
									children: [
										{
											title: 'Client Virtual Wallet',
											icon: 'arrow-ios-forward',
											link: '/dashboard/reports/client-virtual-wallet',
											home: true
										},
										{
											title: 'Instructor Schedule',
											icon: 'arrow-ios-forward',
											link: '/dashboard/reports/instructor-schedule',
											home: true
										},
										{
											title: 'Instructor Commission',
											icon: 'arrow-ios-forward',
											link: '/dashboard/reports/instructor-commission',
											home: true
										},
										{
											title: 'Fuel Intake',
											icon: 'arrow-ios-forward',
											link: '/dashboard/reports/fuel-intake',
											home: true
										},
										{
											title: 'Pass Rate',
											icon: 'arrow-ios-forward',
											link: '/dashboard/reports/pass-rate',
											home: true
										}
									]
								},
								{
									title: 'Vehicle',
									icon: 'car',
									link: '/dashboard/vehicles',
									home: true
								},
								{
									title: 'Company Info',
									icon: 'info',
									link: '/dashboard/setup',
									home: true
								},
								{
									title: 'User Roles',
									icon: 'people',
									link: '/dashboard/roles/all-roles',
									home: true
								},
								{
									title: 'Employee Type',
									icon: 'people',
									children: [
										{
											title: 'All Types',
											icon: 'folder',
											link: '/dashboard/employee-type/all'
										},
										{
											title: 'New Type',
											icon: 'plus-circle',
											home: true,
											link: '/dashboard/employee-type/new'
										}
									]
								},
								{
									title: 'Staff',
									icon: 'people',
									children: [
										{
											title: 'All Staff',
											icon: 'folder',
											link: '/dashboard/staff/all',
											home: true
										},
										{
											title: 'New Member',
											icon: 'plus-circle',
											link: '/dashboard/staff/new',
											home: true
										}
									]
								},
								{
									title: 'Packages',
									icon: 'folder',
									children: [
										{
											title: 'All Packages',
											icon: 'folder',
											link: '/dashboard/packages/all',
											home: true
										},
										{
											title: 'New package',
											icon: 'plus-circle',
											link: '/dashboard/packages/new',
											home: true
										}
									]
								},
								{
									title: 'Service Items',
									icon: 'folder',
									children: [
										{
											title: 'All Service Items',
											icon: 'folder',
											link: '/dashboard/service-items/all',
											home: true
										},
										{
											title: 'Add Service Item',
											icon: 'plus-circle',
											link: '/dashboard/service-items/new',
											home: true
										}
									]
								},
								{
									title: 'Licence Codes',
									icon: 'credit-card',
									link: '/dashboard/licence',
									children: [
										{
											title: 'All licence codes',
											icon: 'folder',
											link: '/dashboard/licence/all'
										},
										{
											title: 'New licence code',
											icon: 'plus-circle',
											link: '/dashboard/licence/new'
										}
									]
								},
								{
									title: 'Lesson tasks',
									icon: 'folder',
									children: [
										{
											title: 'All lesson taskss',
											icon: 'folder',
											link: '/dashboard/lesson-tasks/all',
											home: true
										},
										{
											title: 'Create lesson task',
											icon: 'plus-circle',
											link: '/dashboard/lesson-tasks/new',
											home: true
										}
									]
								}
							]
						);
					} else {
						// normal employee
					}
				}
			}
		});
		this.unsubscribe.push(sub);
	}

	ngOnInit(): void {
		this.nbMenuService
			.onItemClick()
			.pipe(filter(({ tag }) => tag === 'contextMenu'), map(({ item: { title } }) => title))
			.subscribe((title) => {
				switch (title.toLowerCase()) {
					case 'logout':
						this.logout();
						break;
					case 'profile': {
						this.router.navigate([ '/dashboard/profile' ]);
						break;
					}

					default:
						break;
				}
			});
	}

	logout() {
		this.auth.signOut();
	}

	ngOnDestroy(): void {
		this.unsubscribe.forEach((e) => {
			if (!e.closed) {
				e.unsubscribe();
			}
		});
	}
}
