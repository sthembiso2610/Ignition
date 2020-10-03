import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ClientVirtualWalletComponent } from './client-virtual-wallet/client-virtual-wallet.component';
import { InstructorScheduleComponent } from './instructor-schedule/instructor-schedule.component';
import { InstructorCommissionComponent } from './instructor-commission/instructor-commission.component';
import { FuelIntakeComponent } from './fuel-intake/fuel-intake.component';
import { PassRateComponent } from './pass-rate/pass-rate.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


@NgModule({
  declarations: [ClientVirtualWalletComponent, InstructorScheduleComponent, InstructorCommissionComponent, FuelIntakeComponent, PassRateComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ]
})
export class ReportsModule { }
