import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ClientVirtualWalletComponent } from './client-virtual-wallet/client-virtual-wallet.component';
import { InstructorScheduleComponent } from './instructor-schedule/instructor-schedule.component';
import { InstructorCommissionComponent } from './instructor-commission/instructor-commission.component';
import { FuelIntakeComponent } from './fuel-intake/fuel-intake.component';
import { PassRateComponent } from './pass-rate/pass-rate.component';


@NgModule({
  declarations: [ClientVirtualWalletComponent, InstructorScheduleComponent, InstructorCommissionComponent, FuelIntakeComponent, PassRateComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule
  ]
})
export class ReportsModule { }
