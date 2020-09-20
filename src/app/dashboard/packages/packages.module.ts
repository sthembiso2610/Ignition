import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PackagesRoutingModule } from './packages-routing.module';
import { AllPackagesComponent } from './all-packages/all-packages.component';
import { AddPackageComponent } from './add-package/add-package.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UpdateComponent } from './entry/update/update.component';


@NgModule({
  declarations: [AllPackagesComponent, AddPackageComponent, UpdateComponent],
  imports: [
    CommonModule,
    PackagesRoutingModule,
    SharedModule
  ],
  entryComponents: [
    UpdateComponent
  ]
})
export class PackagesModule { }
