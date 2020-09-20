import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { AppState } from 'src/app/state/app.state';
import { Observable } from 'rxjs';
import { Company } from 'src/app/models/company.model';
import { AppInfo } from 'src/app/models';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { FlashService } from 'src/app/services/flash.service';

import { DialogService } from 'src/app/services/dialog.service';
import { DbService } from 'src/app/services/db.service';
import { EmployeeType } from 'src/app/models/employeeType.model';

@Component({
	selector: 'app-all-employee-type',
	templateUrl: './all-employee-type.component.html',
	styleUrls: [ './all-employee-type.component.scss' ]
})
export class AllEmployeeTypeComponent implements OnInit {
	@Select(AppState.company) company$: Observable<Company>;
	@Select(AppState.appInfo) appInfo$: Observable<AppInfo>;

	columns: string[] = [ 'id', 'name', 'desc', 'role', 'actions' ];

	constructor(
		private router: Router,
		private store: Store,
		private db: DbService,
		private dialog: DialogService,
		private loading: NgxSpinnerService,
		private flash: FlashService
	) {}

	getRoleName(id: number): string {
		const info: AppInfo = this.store.snapshot().app.appInfo;
		const index = info.roles.findIndex((e) => e.id == id);
		return index == -1 ? 'n/a' : info.roles[index].name;
	}

	delete(element: EmployeeType) {
		// ! first check if any emps attached to this type

		this.dialog.confirm('Once deleted, you will not be able to recover this record').then((val) => {
			if (val) {
				this.loading.show();
				this.db
					.deleteEmpType(element)
					.then(() => {
						this.loading.hide();
					})
					.catch((e) => {
						this.loading.hide();
						this.flash.open(e.message, 'danger');
					});
			}
		});
	}

	edit(element: EmployeeType) {
		this.router.navigate([ `/dashboard/employee-type/${element.id}/edit` ]);
	}

	ngOnInit(): void {}
}
