import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllServiceItemsComponent } from './all-service-items/all-service-items.component';
import { AddServiceItemComponent } from './add-service-item/add-service-item.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'all',
		pathMatch: 'full'
	},
	{
		path: 'all',
		component: AllServiceItemsComponent
	},
	{
		path: ':id/edit',
		component: AddServiceItemComponent
	},
	{
		path: 'new',
		component: AddServiceItemComponent
	}
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class ServiceItemsRoutingModule {}
