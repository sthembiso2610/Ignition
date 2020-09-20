import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import {AuthGuard} from './services/auth.guard';
import {AuthNegGuard} from './services/auth-neg.guard';

const routes: Routes = [
  {
    path:'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./dashboard/dashboard.module')
    .then(module=>module.DashboardModule)
  },
  {
    path:'auth',
    canActivate: [AuthNegGuard],
    loadChildren: () => import('./auth/auth.module')
    .then(module=>module.AuthModule)
  },
  {
    path:'',
    redirectTo:'dashboard',
    pathMatch: 'full'
  },
  {
    path:'**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
