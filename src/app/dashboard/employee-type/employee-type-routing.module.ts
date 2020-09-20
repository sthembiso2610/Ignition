import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllEmployeeTypeComponent } from '../employee-type/all-employee-type/all-employee-type.component';
import { NewEmpTypeComponent } from './new-emp-type/new-emp-type.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'all',
		pathMatch: 'full'
	},
	{
		path: 'all',
		component: AllEmployeeTypeComponent
	},
	{
		path: 'new',
		component: NewEmpTypeComponent
	},
	{
		path: ':id/edit',
		component: NewEmpTypeComponent
	}
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class EmployeeTypeRoutingModule {}
