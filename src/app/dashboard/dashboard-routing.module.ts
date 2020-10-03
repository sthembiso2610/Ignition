import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { SetupComponent } from './setup/setup.component';
import { SetupGuard } from 'src/app/services/guards/setup.guard';
import { CalendarComponent } from 'src/app/dashboard/calendar/calendar.component';
import { ClientSetupComponent } from 'src/app/dashboard/client-setup/client-setup.component';
import { ClientSetupGuard } from 'src/app/services/guards/client-setup.guard';
import { ClientHomeComponent } from 'src/app/dashboard/client-home/client-home.component';
import { AdminGuard } from 'src/app/services/guards/admin.guard';
import { EmpGuard } from 'src/app/services/guards/emp.guard';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
	{
		path: '',
		component: DashboardComponent,
		children: [
			{
				path: '',
				redirectTo: 'home',
				pathMatch: 'full'
			},
			{
				path: 'home',
				canActivate: [ EmpGuard , SetupGuard ],
				component: HomeComponent
			},
			{
				path: 'profile',
				component: ProfileComponent
			},
			{
				path: 'home-c',
				canActivate: [ ClientSetupGuard ],
				component: ClientHomeComponent
			},
			{
				path: 'calendar',
				component: CalendarComponent
			},
			{
				path: 'setup',
				component: SetupComponent,
				canActivate: [ EmpGuard ]
			},
			{
				path: 'setup-c',
				component: ClientSetupComponent
			},
			{
				path: 'lesson-tasks',
				loadChildren: () => import('./action-plans/action-plans.module').then((m) => m.ActionPlansModule)
			},
			{
				path: 'packages',
				loadChildren: () => import('./packages/packages.module').then((m) => m.PackagesModule)
			},
			{
				path: 'service-items',
				loadChildren: () => import('./service-items/service-items.module').then((m) => m.ServiceItemsModule)
			},
			{
				path: 'reports',
				loadChildren: () => import('./reports/reports.module').then((m) => m.ReportsModule)
			},
			{
				path: 'clients',
				loadChildren: () => import('./clients/clients.module').then((m) => m.ClientsModule)
			},

			{
        path: 'vehicles',
        canActivate: [ EmpGuard],
				loadChildren: () => import('./vehicles/vehicles.module').then((m) => m.VehiclesModule)
			},
			{
				path: 'licence',
				loadChildren: () => import('./licence/licence.module').then((m) => m.LicenceModule)
			},
			{
				path: 'roles',
				loadChildren: () => import('./roles/roles.module').then((m) => m.RolesModule)
			},
			{
				path: 'staff',
				loadChildren: () => import('./employees/employees.module').then((m) => m.EmployeesModule)
			},
			{
				path: 'employee-type',
				loadChildren: () => import('./employee-type/employee-type.module').then((m) => m.EmployeeTypeModule)
			}
		]
	}
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class DashboardRoutingModule {}
