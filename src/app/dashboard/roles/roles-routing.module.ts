import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllRolesComponent } from './all-roles/all-roles.component';
import { NewRoleComponent } from './new-role/new-role.component';

const routes: Routes = [
  {
    path:'',
    redirectTo:'all-roles',
    pathMatch: 'full'
  },
  {
    path:'all-roles',
    component: AllRolesComponent
  },
  {
    path:'new-role',
    component: NewRoleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
