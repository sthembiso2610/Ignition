import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Vehicle } from 'src/app/models/vehicle.model';
import Swal from 'sweetalert2';
import { RefuelComponent } from '../refuel/refuel.component';
import { VehicleService } from '../vehicle.service';

@Component({
  selector: 'app-check-inout',
  templateUrl: './check-inout.component.html',
  styleUrls: ['./check-inout.component.scss']
})
export class CheckInoutComponent implements OnInit {


  vehicles: Vehicle[];
  dataSource = new MatTableDataSource<Vehicle>();
  checkInStatus: boolean;
  cars: Vehicle [] = [];
  outcars: Vehicle [] = [];

  displayedColumns: string[] = [

    'VehicleID',
    'ManufacturerName',
    'ModelName',
    'plate',
    'actions'

  ];

  @ViewChild(MatSort, {static: true}) sort: MatSort;
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  constructor(public route: Router, private dialog: MatDialog,  public service: VehicleService) { }

  ngOnInit(): void {
   // this.vehicles = this.allvehicles;
   // this.dataSource.data = this.vehicles;
   // this.dataSource.sort = this.sort;
   // this.dataSource.paginator = this.paginator;


   this.service.getAll().subscribe(a=>
    {   this.cars= [];
      this.outcars = []
        a.forEach(
          zz=> {
            let car: Vehicle = zz.payload.doc.data()
              car.id = zz.payload.doc.id;
              console.log(car);
              if( car.inUse == true)
              {
                this.checkInStatus = true
                this.cars.push(car)
                this.dataSource.data = this.cars;
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
              // this.route.navigate(['dashboard/vehicles/Check-InOut']);
              }
              else{

             //this.cars = []
                this.outcars.push(car)
                  if(this.cars.length == 0)
                  {
                    this.checkInStatus = false
                this.dataSource.data = this.outcars;
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
                  }
              }
              // this.cars.push(car)
              // this.dataSource.data = this.cars;
              // this.dataSource.sort = this.sort;
              // this.dataSource.paginator = this.paginator;
          }
        )
    }
  )


  }

  status: boolean = false

  Refuel(obj: Vehicle)
    {
      const ref = this.dialog.open(
        RefuelComponent,
        {
           //  height: '600px',
           width: '800px',
           data: obj

        }
      )
       ref.afterClosed().subscribe()
     //  this.route.navigate(['dashboard/vehicles/Refuel'])
    }

    CheckIn(obj: Vehicle)
    {
      Swal.fire({
        title: 'Are you sure you want to check In this vehicle?',
        text: 'You will not be able to reverse this operation',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Yes, Check In!',
        cancelButtonText: 'No'
      }).then((result) => {
        if( result.value)  {
    console.log(result.value)
    this.checkInStatus = false;
    obj.inUse = false;
    this.service.updateVehicle(obj)
   //this.route.navigate(['dashboard/vehicles/Check-InOut']);
    //  this.status = false;
    //  this.route.navigate(['dashboard/vehicle/check']);
    }
  })
}

applyFilter(event: Event)
{
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

CheckOut(obj: Vehicle)
{
  Swal.fire({
    title: 'Are you sure you want to check Out this vehicle?',
    text: 'You will not be able to reverse this operation',
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: 'Yes, Check Out!',
    cancelButtonText: 'No'
  }).then((result) => {
    if( result.value)  {
console.log(result.value)
this.checkInStatus = true;

obj.inUse = true;
this.service.updateVehicle(obj)

//  this.status = false;
 // this.route.navigate(['dashboard/vehicles/Check-InOut']);
}
})
}
}
