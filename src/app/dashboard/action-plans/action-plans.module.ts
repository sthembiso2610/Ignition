import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllActionPlanItemsComponent } from './all-action-plan-items/all-action-plan-items.component';
import { NewActionPlanItemComponent } from './new-action-plan-item/new-action-plan-item.component';
import { ViewActionPlanItemComponent } from './view-action-plan-item/view-action-plan-item.component';
import { ViewActionPlanComponent } from './view-action-plan/view-action-plan.component';
import { ActionPlansRoutingModule } from './action-plans-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
	declarations: [
		AllActionPlanItemsComponent,
		NewActionPlanItemComponent,
		ViewActionPlanItemComponent,
		ViewActionPlanComponent
	],
	imports: [ CommonModule, ActionPlansRoutingModule, SharedModule ]
})
export class ActionPlansModule {}
