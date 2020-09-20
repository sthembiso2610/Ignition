import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientVirtualWalletComponent } from './client-virtual-wallet/client-virtual-wallet.component';
import { FuelIntakeComponent } from './fuel-intake/fuel-intake.component';
import { InstructorCommissionComponent } from './instructor-commission/instructor-commission.component';
import { InstructorScheduleComponent } from './instructor-schedule/instructor-schedule.component';
import { PassRateComponent } from './pass-rate/pass-rate.component';

const routes: Routes = [
  {
    path:'',
    redirectTo:'instructor-schedule',
    pathMatch: 'full'
  },
  {
    path:'client-virtual-wallet',
    component: ClientVirtualWalletComponent
  },
  {
    path:'fuel-intake',
    component: FuelIntakeComponent
  },
  {
    path:'instructor-commission',
    component: InstructorCommissionComponent
  },
  {
    path:'instructor-schedule',
    component: InstructorScheduleComponent
  },
  {
    path:'pass-rate',
    component: PassRateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
