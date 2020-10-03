import { Component, OnInit, OnDestroy, ViewChild, Inject } from '@angular/core';
import { Client } from '../../../models/client.model';
import { Select } from '@ngxs/store';
import { AppState } from 'src/app/state/app.state';
import { Observable, Subscription } from 'rxjs';
import { Company } from 'src/app/models/company.model';
import { Employee } from 'src/app/models/employee.model';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IGNUser } from 'src/app/models/user.model';
import { NbMenuService, NB_WINDOW } from '@nebular/theme';
import { DialogService } from 'src/app/services/dialog.service';
import { Router } from '@angular/router';
import { FlashService } from 'src/app/services/flash.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DbService } from 'src/app/services/db.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { PurchasePackageComponent } from '../../entry/purchase-package/purchase-package.component';
import { TopupComponent } from '../../entry/topup/topup.component';

@Component({
	selector: 'app-all-clients',
	templateUrl: './all-clients.component.html',
	styleUrls: [ './all-clients.component.scss' ]
})
export class AllClientsComponent implements OnInit, OnDestroy {
	@Select(AppState.company) company$: Observable<Company>;
	@Select(AppState.clients) clients$: Observable<Client[]>;

	columns: string[] = [ 'status', 'firstname', 'lastname', 'email', 'phone', 'actions' ];
clients: Client[]

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
		private matDialog: MatDialog,
		private flash: FlashService,
		private loading: NgxSpinnerService,
		private db: DbService
	) {
		const sub = this.clients$.subscribe((data) => (this.dataSource.data = data));
		this.unsubscribe.push(sub);
	}

	getType(id: string, company: Company): string {
		const index = company.empTypes.findIndex((e) => e.id == id);
		return index == -1 ? 'not found' : company.empTypes[index].name;
	}

	ngOnInit(): void {


    this.db.getAllClients().subscribe(a=>
      {
          this.clients = [];
          a.forEach(
            zz=> {
              let aclient : Client = zz.payload.doc.data()
              aclient.uid = zz.payload.doc.id

              this.clients.push(aclient)
              this.dataSource.data = this.clients
            }
          )
      })

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
				let user: IGNUser = item.item.data.user;
				switch (title.toLowerCase()) {
					case 'view': {
						this.router.navigate([ `/dashboard/staff/${user.uid}` ]);
						break;
					}

					case 'deactivate': {
						this.loading.show();
						this.db
							.updateUser(user.uid, {
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
							.updateUser(user.uid, {
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

					case 'purchase package': {
						this.purchasePackage(user);
						break;
					}

					case 'topup wallet': {
						this.topUp(user);
						break;
					}

					default:
						break;
				}
			});
	}

	topUp(user) {
		console.log('USER USER', user);
		const dialogConfig = new MatDialogConfig();

		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.data = user;
		this.matDialog.open(TopupComponent, dialogConfig);
	}

	purchasePackage(user) {
		console.log('USER to purchase', user);
		const dialogConfig = new MatDialogConfig();

		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.data = user;
		this.matDialog.open(PurchasePackageComponent, dialogConfig);
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
