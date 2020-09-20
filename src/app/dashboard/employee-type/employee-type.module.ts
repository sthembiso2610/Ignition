import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeTypeRoutingModule } from './employee-type-routing.module';
import { AllEmployeeTypeComponent } from './all-employee-type/all-employee-type.component';
import { ViewEmployeeTypeComponent } from './view-employee-type/view-employee-type.component';
import { UpdateEmployeeTypeComponent } from './update-employee-type/update-employee-type.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NewEmpTypeComponent } from './new-emp-type/new-emp-type.component';


@NgModule({
  declarations: [AllEmployeeTypeComponent, ViewEmployeeTypeComponent, UpdateEmployeeTypeComponent, NewEmpTypeComponent],
  imports: [
    CommonModule,
    EmployeeTypeRoutingModule,
    SharedModule
  ]
})
export class EmployeeTypeModule { }
