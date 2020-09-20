import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllEmployeesComponent } from '../employees/all-employees/all-employees.component';
import { NewEmployeeComponent } from './new-employee/new-employee.component';
import { EmpHoursComponent } from './emp-hours/emp-hours.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'all',
		pathMatch: 'full'
	},
	{
		path: 'all',
		component: AllEmployeesComponent
	},
	{
		path: ':id',
		component: NewEmployeeComponent
	},
	{
		path: 'hours/:id',
		component: EmpHoursComponent
	},
	{
		path: 'new',
		component: NewEmployeeComponent
	}
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class EmployeesRoutingModule {}
