import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	NbInputModule,
	NbButtonModule,
	NbIconModule,
	NbActionsModule,
	NbUserModule,
	NbContextMenuModule,
	NbSpinnerModule,
	NbCardModule,
	NbStepperModule
} from '@nebular/theme';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxMaskModule } from 'ngx-mask';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		NbInputModule,
		NbIconModule,
		NbActionsModule,
		NbUserModule,
		NbContextMenuModule,
		NbSpinnerModule,
		MatTableModule,
		MatDialogModule,
		MatButtonModule,
		MatFormFieldModule,
		MatIconModule,
		NbCardModule,
		FormsModule,
		ReactiveFormsModule,
		MatInputModule,
		MatSortModule,
		MatPaginatorModule,
		NbStepperModule,
		MatTabsModule,
		NgxMaskModule.forRoot(),
		MatRadioModule,
		MatSelectModule,
		MatStepperModule,
		MatSlideToggleModule,
		MatCheckboxModule,
		MatListModule,
		MatChipsModule,
		MatBadgeModule,
		MatAutocompleteModule,
		MatDatepickerModule
	],
	exports: [
		NbButtonModule,
		NbInputModule,
		NbIconModule,
		NbActionsModule,
		NbUserModule,
		NbContextMenuModule,
		NbSpinnerModule,
		MatTableModule,
		MatDialogModule,
		MatButtonModule,
		MatFormFieldModule,
		MatIconModule,

		NbCardModule,
		FormsModule,
		ReactiveFormsModule,
		MatInputModule,
		MatSortModule,
		MatPaginatorModule,
		NbStepperModule,
		MatTabsModule,
		NgxMaskModule,
		MatRadioModule,
		MatSelectModule,
		MatStepperModule,
		MatSlideToggleModule,
		MatCheckboxModule,
		MatListModule,
		MatChipsModule,
		MatBadgeModule,
		MatAutocompleteModule,
		MatDatepickerModule
	]
})
export class SharedModule {}
