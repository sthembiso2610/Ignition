import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { IGNPackage } from '../../../models/package.model';
import { MatDialog } from '@angular/material/dialog';
import { UpdateComponent } from '../entry/update/update.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { Select } from '@ngxs/store';
import { AppState } from 'src/app/state/app.state';
import { Observable, Subscription } from 'rxjs';
import { Company } from 'src/app/models/company.model';
import { AppInfo } from 'src/app/models';
import { DialogService } from 'src/app/services/dialog.service';
import { Router } from '@angular/router';
import { FlashService } from 'src/app/services/flash.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DbService } from 'src/app/services/db.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
	selector: 'app-all-packages',
	templateUrl: './all-packages.component.html',
	styleUrls: [ './all-packages.component.scss' ],
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({ height: '0px', minHeight: '0' })),
			state('expanded', style({ height: '*' })),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
		])
	]
})
export class AllPackagesComponent implements OnInit, OnDestroy {
	dataSource = new MatTableDataSource<IGNPackage>();
	@Select(AppState.company) company$: Observable<Company>;
	@Select(AppState.appInfo) appInfo$: Observable<AppInfo>;
	@Select(AppState.packages) packages$: Observable<IGNPackage[]>;

	columnsToDisplay: string[] = [ 'name', 'desc', 'price', 'active', 'actions' ];
	expandedElement: IGNPackage;

	@ViewChild(MatSort, { static: true })
	sort: MatSort;
	@ViewChild(MatPaginator, { static: true })
	paginator: MatPaginator | null;
	unsubscribe: Subscription[] = [];

	constructor(
		private dialog: DialogService,
		private router: Router,
		private flash: FlashService,
		private loading: NgxSpinnerService,
		private db: DbService
	) {
		const sub = this.packages$.subscribe((data) => (this.dataSource.data = data));
		this.unsubscribe.push(sub);
	}

	ngOnInit(): void {
		this.dataSource.sort = this.sort;
		this.dataSource.paginator = this.paginator;
	}

	edit(item: IGNPackage) {
		this.router.navigate([ `/dashboard/packages/${item.id}/edit` ]);
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	delete(element: IGNPackage) {
		this.dialog.confirm('Are you sure you wish to delete this package?').then((val) => {
			if (val) {
				// delete here
				this.loading.show();
				this.db
					.deletePackage(element)
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

	ngOnDestroy(): void {
		this.unsubscribe.forEach((e) => {
			if (!e.closed) {
				e.unsubscribe();
			}
		});
	}
}
