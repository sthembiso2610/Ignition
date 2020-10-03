import { Component, OnInit, ViewChild, OnDestroy, Inject } from '@angular/core';
import { Select } from '@ngxs/store';
import { AppState } from 'src/app/state/app.state';
import { Observable, Subscription } from 'rxjs';
import { Employee } from 'src/app/models/employee.model';
import { Company } from 'src/app/models/company.model';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { IGNUser } from 'src/app/models/user.model';
import { MatTableDataSource } from '@angular/material/table';
import { NbMenuService, NB_WINDOW } from '@nebular/theme';
import { DialogService } from 'src/app/services/dialog.service';
import { Router } from '@angular/router';
import { FlashService } from 'src/app/services/flash.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DbService } from 'src/app/services/db.service';
import { filter, map } from 'rxjs/operators';

@Component({
	selector: 'app-all-employees',
	templateUrl: './all-employees.component.html',
	styleUrls: [ './all-employees.component.scss' ]
})
export class AllEmployeesComponent implements OnInit, OnDestroy {
	@Select(AppState.company) company$: Observable<Company>;
	@Select(AppState.employees) employees$: Observable<Employee[]>;

	columns: string[] = [ 'status', 'firstname', 'lastname', 'email', 'phone', 'type', 'actions' ];
  employees: Employee[]

	@ViewChild(MatSort, { static: true })
	sort: MatSort;
	@ViewChild(MatPaginator, { static: true })
	paginator: MatPaginator | null;
	unsubscribe: Subscription[] = [];
	dataSource = new MatTableDataSource<IGNUser>();

	constructor(
		private nbMenuService: NbMenuService,
		@Inject(NB_WINDOW) private window,
		private dialog: DialogService,
		private router: Router,
		private flash: FlashService,
		private loading: NgxSpinnerService,
		private db: DbService
	) {
	//	const sub = this.employees$.subscribe((data) => (this.dataSource.data = data));
    //this.unsubscribe.push(sub);


    this.db.getAllEmployees().subscribe(a=>
      {
        this.employees = [];
        a.forEach(
          zz=> {
            let emp: Employee = zz.payload.doc.data()
            emp.uid = zz.payload.doc.id;

            this.employees.push(emp)
            this.dataSource.data = this.employees
          }
        )
      })
	}

	getType(id: string, company: Company): string {
		const index = company.empTypes.findIndex((e) => e.id == id);
		return index == -1 ? 'not found' : company.empTypes[index].name;
	}

	ngOnInit(): void {
    console.log('befor gettin')



		this.dataSource.sort = this.sort;
		this.dataSource.paginator = this.paginator;

		this.nbMenuService
			.onItemClick()
			// .pipe(
			// 	filter(({ tag }) => tag === 'contextMenu')
			// 	// map(({ item: { title } }) => title)
			// )
			.subscribe((item) => {
				if (item.item.data == undefined) {
					return;
				}
				let title: string = item.item.title;
				let uid: string = item.item.data.uid;
				switch (title.toLowerCase()) {
					case 'view': {
						this.router.navigate([ `/dashboard/staff/${uid}` ]);
						break;
					}

					case 'deactivate': {
						this.loading.show();
						this.db
							.updateUser(uid, {
								isActive: false
							})
							.then(() => {
								this.loading.hide();
								this.flash.open('User deactivated', 'success');
							})
							.catch((e) => {
								this.loading.hide();
								this.flash.open(e.message, 'danger');
							});
						break;
					}

					case 'activate': {
						this.loading.show();
						this.db
							.updateUser(uid, {
								isActive: true
							})
							.then(() => {
								this.loading.hide();
								this.flash.open('User activated', 'success');
							})
							.catch((e) => {
								this.loading.hide();
								this.flash.open(e.message, 'danger');
							});
						break;
					}

					case 'update working hours': {
						this.router.navigate([ `/dashboard/staff/hours/${uid}` ]);
						break;
					}

					case 'activate': {
						break;
					}

					default:
						break;
				}
			});
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	ngOnDestroy(): void {
		this.unsubscribe.forEach((e) => {
			if (!e.closed) {
				e.unsubscribe();
			}
		});
	}
}
