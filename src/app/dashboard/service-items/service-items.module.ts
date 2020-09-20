import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceItemsRoutingModule } from './service-items-routing.module';
import { AddServiceItemComponent } from './add-service-item/add-service-item.component';
import { AllServiceItemsComponent } from './all-service-items/all-service-items.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
	declarations: [ AddServiceItemComponent, AllServiceItemsComponent ],
	imports: [ CommonModule, ServiceItemsRoutingModule, SharedModule ]
})
export class ServiceItemsModule {}
