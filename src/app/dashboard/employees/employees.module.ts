import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllEmployeesComponent } from './all-employees/all-employees.component';
import { ViewEmployeesComponent } from './view-employees/view-employees.component';
import { UpdateEmployeesComponent } from './update-employees/update-employees.component';
import { EmployeesRoutingModule } from './employees-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NewEmployeeComponent } from './new-employee/new-employee.component';
import { EmpHoursComponent } from './emp-hours/emp-hours.component';



@NgModule({
  declarations: [AllEmployeesComponent, ViewEmployeesComponent, UpdateEmployeesComponent, NewEmployeeComponent, EmpHoursComponent],
  imports: [
    CommonModule,
    EmployeesRoutingModule,
    SharedModule
  ]
})
export class EmployeesModule { }
