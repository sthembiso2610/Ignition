import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewAppointmentComponent } from './new-appointment/new-appointment.component';
import { ViewAppointmentComponent } from './view-appointment/view-appointment.component';



@NgModule({
  declarations: [NewAppointmentComponent, ViewAppointmentComponent],
  imports: [
    CommonModule
  ]
})
export class AppointmentsModule { }
