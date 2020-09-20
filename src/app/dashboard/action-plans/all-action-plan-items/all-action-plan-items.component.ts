import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { AppState } from 'src/app/state/app.state';
import { Observable, Subscription } from 'rxjs';
import { Company } from 'src/app/models/company.model';
import { AppInfo } from 'src/app/models';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FlashService } from 'src/app/services/flash.service';

import { DialogService } from 'src/app/services/dialog.service';
import { DbService } from 'src/app/services/db.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ActionPlanItem } from 'src/app/models/LicenceCode.model';

@Component({
	selector: 'app-all-action-plan-items',
	templateUrl: './all-action-plan-items.component.html',
	styleUrls: [ './all-action-plan-items.component.scss' ]
})
export class AllActionPlanItemsComponent implements OnInit, OnDestroy {
	@Select(AppState.company) company$: Observable<Company>;
	@Select(AppState.appInfo) appInfo$: Observable<AppInfo>;
	@Select(AppState.actionPlanItems) actionPlanItems$: Observable<ActionPlanItem[]>;

	columns: string[] = [ 'select', 'name', 'desc' ];
	localItems: ActionPlanItem[] = [];
	unsubscribe: Subscription[] = [];

	dataSource = new MatTableDataSource<ActionPlanItem>(this.localItems);
	selection = new SelectionModel<ActionPlanItem>(true, []);

	constructor(
		private router: Router,
		private store: Store,
		private db: DbService,
		private dialog: DialogService,
		private loading: NgxSpinnerService,
		private flash: FlashService
	) {}

	ngOnInit(): void {
		const sub = this.actionPlanItems$.subscribe((data) => {
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

	delete(items: ActionPlanItem[]) {
		// ! first check if any emps attached to this type

		this.dialog.confirm('Once deleted, you will not be able to recover these items').then((val) => {
			if (val) {
				this.loading.show();
				this.db
					.deleteActionPlanItemMultiple(items)
					.then(() => {
						this.loading.hide();
						this.selection.clear();
					})
					.catch((e) => {
						this.loading.hide();
						this.flash.open(e.message, 'danger');
					});
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
	checkboxLabel(row?: ActionPlanItem): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
		}
		return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
	}

	edit(val: ActionPlanItem[]) {
		this.router.navigate([ `/dashboard/lesson-tasks/${val[0].id}/edit` ]);
	}

	ngOnDestroy(): void {
		this.unsubscribe.forEach((e) => {
			if (!e.closed) {
				e.unsubscribe();
			}
		});
	}
}
