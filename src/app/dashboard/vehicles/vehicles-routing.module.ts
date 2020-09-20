import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllVehiclesComponent } from './all-vehicles/all-vehicles.component';
import { NewVehicleComponent } from './new-vehicle/new-vehicle.component';

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
	}
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class VehiclesRoutingModule {}
