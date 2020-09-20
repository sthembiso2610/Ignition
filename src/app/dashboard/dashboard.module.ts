import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NbLayoutModule, NbSidebarModule, NbMenuModule } from '@nebular/theme';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { SetupComponent } from './setup/setup.component';
import { SetupStepOneComponent } from './setup/setup-step-one/setup-step-one.component';
import { SetupStepTwoComponent } from './setup/setup-step-two/setup-step-two.component';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import { CalendarComponent } from './calendar/calendar.component';
import { ClientSetupComponent } from './client-setup/client-setup.component';
import { ClientHomeComponent } from './client-home/client-home.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { TimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { EventComponent } from './entry/event/event.component';
import { TopupComponent } from './entry/topup/topup.component';
import { ProfileComponent } from './profile/profile.component';
import { PurchasePackageComponent } from './entry/purchase-package/purchase-package.component';

@NgModule({
	declarations: [
		DashboardComponent,
		HomeComponent,
		SetupComponent,
		SetupStepOneComponent,
		SetupStepTwoComponent,
		CalendarComponent,
		ClientSetupComponent,
		ClientHomeComponent,
		EventComponent,
		TopupComponent,
		ProfileComponent,
		PurchasePackageComponent
	],
	imports: [
		CommonModule,
		DashboardRoutingModule,
		NbLayoutModule,
		NbSidebarModule.forRoot(),
		NbMenuModule.forRoot(),
		SharedModule,
		ScheduleModule,
		TimePickerModule,
		GooglePlaceModule
	],
	entryComponents: [ EventComponent, TopupComponent ]
})
export class DashboardModule {}
