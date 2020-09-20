import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { AppState } from 'src/app/state/app.state';
import { Observable, Subscription } from 'rxjs';
import { Company } from 'src/app/models/company.model';
import { AppInfo } from 'src/app/models';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { FlashService } from 'src/app/services/flash.service';

import { DialogService } from 'src/app/services/dialog.service';
import { DbService } from 'src/app/services/db.service';
import { EmployeeType } from 'src/app/models/employeeType.model';
import { ServiceItem } from 'src/app/models/serviceItem.model';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
	selector: 'app-all-service-items',
	templateUrl: './all-service-items.component.html',
	styleUrls: [ './all-service-items.component.scss' ]
})
export class AllServiceItemsComponent implements OnInit, OnDestroy {
	@Select(AppState.company) company$: Observable<Company>;
	@Select(AppState.appInfo) appInfo$: Observable<AppInfo>;
	@Select(AppState.serviceItems) serviceitems$: Observable<ServiceItem[]>;

	columns: string[] = [ 'select', 'name', 'bookable', 'cost' ];
	localItems: ServiceItem[] = [];
	unsubscribe: Subscription[] = [];

	dataSource = new MatTableDataSource<ServiceItem>(this.localItems);
	selection = new SelectionModel<ServiceItem>(true, []);

	constructor(
		private router: Router,
		private store: Store,
		private db: DbService,
		private dialog: DialogService,
		private loading: NgxSpinnerService,
		private flash: FlashService
	) {}

	ngOnInit(): void {
		const sub = this.serviceitems$.subscribe((data) => {
			this.localItems = data;
			this.dataSource.data = this.localItems;
		});
		this.unsubscribe.push(sub);
	}

	getRoleName(id: number): string {
		const info: AppInfo = this.store.snapshot().app.appInfo;
		const index = info.roles.findIndex((e) => e.id == id);
		return index == -1 ? 'n/a' : info.roles[index].name;
	}

	delete(items: ServiceItem[]) {
		// ! first check if any emps attached to this type

		this.dialog.confirm('Once deleted, you will not be able to recover these records').then((val) => {
			if (val) {
				this.loading.show();
				this.db
					.deleteServiceItemMultiple(items)
					.then(() => {
						this.loading.hide();
						this.selection.clear();
					})
					.catch((e) => {
						this.loading.hide();
						this.flash.open(e.message, 'danger');
					});
			} else {
				console.log('dont delete');
			}
		});
	}

	/** Whether the number of selected elements matches the total number of rows. */
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle() {
		this.isAllSelected()
			? this.selection.clear()
			: this.dataSource.data.forEach((row) => this.selection.select(row));
	}

	/** The label for the checkbox on the passed row */
	checkboxLabel(row?: ServiceItem): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
		}
		return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
	}

	edit(val: ServiceItem[]) {
		this.router.navigate([ `/dashboard/service-items/${val[0].id}/edit` ]);
	}

	ngOnDestroy(): void {
		this.unsubscribe.forEach((e) => {
			if (!e.closed) {
				e.unsubscribe();
			}
		});
	}
}
