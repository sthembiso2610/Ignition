import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllVehiclesComponent } from './all-vehicles/all-vehicles.component';
import { CheckInoutComponent } from './check-inout/check-inout.component';
import { NewVehicleComponent } from './new-vehicle/new-vehicle.component';
import { RefuelComponent } from './refuel/refuel.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'all',
		pathMatch: 'full'
	},

	{
		path: 'all',
		component: AllVehiclesComponent
	},
	{
		path: 'new',
		component: NewVehicleComponent
  },

  {
    path: ':id/edit',
    component: NewVehicleComponent
  },

  {
    path: 'Check-InOut',
    component: CheckInoutComponent
  },

  {
    path: 'Refuel',
    component: RefuelComponent
  }



];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class VehiclesRoutingModule {}
