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
import { Observable } from 'rxjs';
import { Company } from 'src/app/models/company.model';
import { AppInfo } from 'src/app/models';
import { IGNUser } from 'src/app/models/user.model';

@Component({
	selector: 'app-all-vehicles',
	templateUrl: './all-vehicles.component.html',
	styleUrls: [ './all-vehicles.component.scss' ]
})
export class AllVehiclesComponent implements OnInit {
	vehicles: Vehicle[] = [];
	cars: Vehicle[] = [];
	isLoading = false;
	dataSource = new MatTableDataSource<Vehicle>();
	@Select(AppState.company) company$: Observable<Company>;
	@Select(AppState.appInfo) appInfo$: Observable<AppInfo>;
	@Select(AppState.user) user$: Observable<IGNUser>;

	displayedColumns: string[] = [ 'ManufacturerName', 'ModelName', 'plate', 'discExpiry', 'SpecialNeeds', 'actions' ];

	@ViewChild(MatSort, { static: true })
	sort: MatSort;
	@ViewChild(MatPaginator, { static: true })
	paginator: MatPaginator;

	constructor(private dialog: MatDialog, public router: Router, private db: DbService) {
		const sub = this.company$.subscribe((comp) => {
			this.dataSource.data = comp.vehicles;
		});
	}

	expDate: any;
	ngOnInit(): void {}

	edit(index: Vehicle) {}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	add() {
		this.router.navigate([ '/dashboard/vehicles/new' ]);
	}

	view(index: Vehicle) {}

	delete(index: Vehicle) {}
}
