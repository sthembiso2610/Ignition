import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehiclesRoutingModule } from './vehicles-routing.module';
import { AllVehiclesComponent } from './all-vehicles/all-vehicles.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NewVehicleComponent } from './new-vehicle/new-vehicle.component';

@NgModule({
	declarations: [ AllVehiclesComponent, NewVehicleComponent ],
	imports: [ CommonModule, VehiclesRoutingModule, SharedModule ]
})
export class VehiclesModule {}
