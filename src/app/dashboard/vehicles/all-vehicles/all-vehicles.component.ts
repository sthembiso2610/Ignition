import { Component, OnInit, ViewChild } from '@angular/core';
import { Vehicle } from 'src/app/models/vehicle.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DbService } from 'src/app/services/db.service';
import { Select } from '@ngxs/store';
import { AppState } from 'src/app/state/app.state';
import { Observable, Subscription } from 'rxjs';
import { Company } from 'src/app/models/company.model';
import { AppInfo } from 'src/app/models';
import { IGNUser } from 'src/app/models/user.model';
import { DialogService } from 'src/app/services/dialog.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FlashService } from 'src/app/services/flash.service';
import { SelectionModel } from '@angular/cdk/collections';
import { VehicleService } from '../vehicle.service';

@Component({
	selector: 'app-all-vehicles',
	templateUrl: './all-vehicles.component.html',
	styleUrls: [ './all-vehicles.component.scss' ]
})
export class AllVehiclesComponent implements OnInit {
	vehicles: Vehicle[] = [];
	cars: Vehicle[] = [];
  isLoading = false;
  unsubscribe: Subscription[] = [];
	dataSource = new MatTableDataSource<Vehicle>();
	@Select(AppState.company) company$: Observable<Company>;
	@Select(AppState.appInfo) appInfo$: Observable<AppInfo>;
	@Select(AppState.user) user$: Observable<IGNUser>;


  selection = new SelectionModel<Vehicle>(true, []);

	displayedColumns: string[] = [ 'ManufacturerName', 'ModelName', 'plate', 'discExpiry', 'SpecialNeeds', 'actions' ];

	@ViewChild(MatSort, { static: true })
	sort: MatSort;
	@ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

	constructor(private dialog: DialogService, private service: VehicleService,
		private loading: NgxSpinnerService,
		private flash: FlashService, public router: Router, private db: DbService) {
		const sub = this.company$.subscribe((comp) =>
		(	this.dataSource.data = comp.vehicles));
    this.unsubscribe.push(sub);
  }

	expDate: any;
  ngOnInit(): void {

    this.service.getAll().subscribe(a=>
      {   this.cars= [];
          a.forEach(
            zz=> {
              let car: Vehicle = zz.payload.doc.data()
                car.id = zz.payload.doc.id;

           this.cars.push(car)
           this.dataSource.data = this.cars;
  })
})
  }

	// edit(index: Vehicle) {}

	// applyFilter(event: Event) {
	// 	const filterValue = (event.target as HTMLInputElement).value;
	// 	this.dataSource.filter = filterValue.trim().toLowerCase();
	// }

	add() {
		this.router.navigate([ '/dashboard/vehicles/new' ]);
	}



  delete(element: Vehicle) {
		// ! first check if any emps attached to this type

		this.dialog.confirm('Once deleted, you will not be able to recover this record').then((val) => {
			if (val) {
				this.loading.show();
				this.db.deleteVehicle(element)
					.then(() => {
						this.loading.hide();
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

  edit(element: Vehicle) {

    this.router.navigate([`/dashboard/vehicles/${element.id}/edit`]).then(z=>
      this.service.Vehicle = element);
	}

  ngOnDestroy(): void {
		this.unsubscribe.forEach((e) => {
			if (!e.closed) {
				e.unsubscribe();
			}
		});
	}

}
