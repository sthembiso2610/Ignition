import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllActionPlanItemsComponent } from './all-action-plan-items/all-action-plan-items.component';
import { ViewActionPlanItemComponent } from './view-action-plan-item/view-action-plan-item.component';
import { ViewActionPlanComponent } from './view-action-plan/view-action-plan.component';
import { NewActionPlanItemComponent } from './new-action-plan-item/new-action-plan-item.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'all',
		pathMatch: 'full'
	},
	{
		path: 'all',
		component: AllActionPlanItemsComponent
	},
	{
		path: ':id/edit',
		component: NewActionPlanItemComponent
	},
	{
		path: 'new',
		component: NewActionPlanItemComponent
	}
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class ActionPlansRoutingModule {}
