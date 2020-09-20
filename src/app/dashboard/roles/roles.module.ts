import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { AllRolesComponent } from './all-roles/all-roles.component';
import { NewRoleComponent } from './new-role/new-role.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [AllRolesComponent, NewRoleComponent],
  imports: [
    CommonModule,
    RolesRoutingModule,
    SharedModule
  ]
})
export class RolesModule { }
