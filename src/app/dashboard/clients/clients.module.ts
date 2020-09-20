import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';
import { AllClientsComponent } from './all-clients/all-clients.component';
import { InviteClientComponent } from './register-client/register-client.component';
import { ViewClientComponent } from './view-client/view-client.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
	declarations: [ AllClientsComponent, InviteClientComponent, ViewClientComponent ],
	imports: [ CommonModule, ClientsRoutingModule, SharedModule ]
})
export class ClientsModule {}
