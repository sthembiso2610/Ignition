import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllClientsComponent } from './all-clients/all-clients.component';
import { InviteClientComponent } from './register-client/register-client.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'all',
		pathMatch: 'full'
	},
	{
		path: 'all',
		component: AllClientsComponent
	},
	{
		path: 'new',
		component: InviteClientComponent
	}
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class ClientsRoutingModule {}
