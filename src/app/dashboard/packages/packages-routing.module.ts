import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllPackagesComponent } from './all-packages/all-packages.component';
import { AddPackageComponent } from './add-package/add-package.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'all',
		pathMatch: 'full'
	},
	{
		path: 'all',
		component: AllPackagesComponent
	},
	{
		path: ':id/edit',
		component: AddPackageComponent
	},
	{
		path: 'new',
		component: AddPackageComponent
	}
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class PackagesRoutingModule {}
