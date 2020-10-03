import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { VehiclesRoutingModule } from './vehicles-routing.module';
import { AllVehiclesComponent } from './all-vehicles/all-vehicles.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NewVehicleComponent } from './new-vehicle/new-vehicle.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CheckInoutComponent } from './check-inout/check-inout.component';
import { RefuelComponent } from './refuel/refuel.component';

@NgModule({
	declarations: [ AllVehiclesComponent, NewVehicleComponent, CheckInoutComponent, RefuelComponent ],
  imports: [ CommonModule, VehiclesRoutingModule, SharedModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers:
  [
    DatePipe
  ]
})
export class VehiclesModule {}
