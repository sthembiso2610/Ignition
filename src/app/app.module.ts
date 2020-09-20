import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AppState } from './state/app.state';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
	declarations: [ AppComponent, NotFoundComponent ],
	imports: [
		BrowserModule,
		AppRoutingModule,
		NgxsModule.forRoot([ AppState ]),
		NgxsReduxDevtoolsPluginModule.forRoot(),
		MatSnackBarModule,
		AngularFireModule.initializeApp(environment.firebaseConfig),
		AngularFirestoreModule,
		BrowserAnimationsModule,
		NbThemeModule.forRoot({ name: 'default' }),
		NbEvaIconsModule,
		NgxSpinnerModule
	],
	providers: [],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
