import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LicenceRoutingModule } from './licence-routing.module';
import { AllLicenceComponent } from './all-licence/all-licence.component';
import { NewLicenceCodeComponent } from './new-licence-code/new-licence-code.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
	declarations: [ AllLicenceComponent, NewLicenceCodeComponent ],
	imports: [ CommonModule, LicenceRoutingModule, SharedModule ]
})
export class LicenceModule {}
