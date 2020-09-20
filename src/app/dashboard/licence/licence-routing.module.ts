import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllLicenceComponent } from './all-licence/all-licence.component';
import { NewLicenceCodeComponent } from './new-licence-code/new-licence-code.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'all',
		pathMatch: 'full'
	},
	{
		path: 'all',
		component: AllLicenceComponent
	},
	{
		path: 'new',
		component: NewLicenceCodeComponent
	},
	{
		path: ':id/edit',
		component: NewLicenceCodeComponent
	}
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class LicenceRoutingModule {}
