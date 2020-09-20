import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { AppState } from 'src/app/state/app.state';
import { Observable, Subscription } from 'rxjs';
import { Company } from 'src/app/models/company.model';
import { AppInfo } from 'src/app/models';
import { IGNUser } from 'src/app/models/user.model';
import { DialogService } from 'src/app/services/dialog.service';
import { Router } from '@angular/router';
import { FlashService } from 'src/app/services/flash.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DbService } from 'src/app/services/db.service';
import { IGNPackage } from 'src/app/models/package.model';
import { MatTableDataSource } from '@angular/material/table';
import { IGNTransaction } from 'src/app/models/transaction.model';
import { PaymentMethod } from 'src/app/models/paymentType.model';

@Component({
	selector: 'app-client-home',
	templateUrl: './client-home.component.html',
	styleUrls: [ './client-home.component.scss' ]
})
export class ClientHomeComponent implements OnInit {
	@Select(AppState.company) company$: Observable<Company>;
	@Select(AppState.appInfo) appInfo$: Observable<AppInfo>;
	@Select(AppState.user) user$: Observable<IGNUser>;
	@Select(AppState.myPackages) myPackages$: Observable<IGNPackage[]>;
	@Select(AppState.myTransactions) myTransactions$: Observable<IGNTransaction[]>;
	@Select(AppState.walletBalance) balance$: Observable<number>;
	dataSource = new MatTableDataSource<IGNPackage>();
	transDataSource = new MatTableDataSource<IGNTransaction>();
	unsubscribe: Subscription[] = [];
	columnsToDisplay: string[] = [ 'name', 'price', 'date' ];
	transColumnsToDisplay: string[] = [ 'date', 'amount', 'paymentMethod' ];

	expandedPackage: IGNPackage | null;

	constructor(
		private store: Store,
		private dialog: DialogService,
		private router: Router,
		private flash: FlashService,
		private loading: NgxSpinnerService,
		private db: DbService
	) {
		const sub = this.myPackages$.subscribe((data) => (this.dataSource.data = data));
		this.unsubscribe.push(sub);

		const sub1 = this.myTransactions$.subscribe((data) => (this.transDataSource.data = data));
		this.unsubscribe.push(sub1);
	}

	getType(types: PaymentMethod[], id: string) {
		let index: number = types.findIndex((e) => e.id == id);
		return index == -1 ? 'N/A' : types[index].name;
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}
	applyTransFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.transDataSource.filter = filterValue.trim().toLowerCase();
	}

	ngOnInit(): void {}
}
