import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Vehicle } from 'src/app/models/vehicle.model';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FlashService } from 'src/app/services/flash.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DbService } from 'src/app/services/db.service';

@Component({
	selector: 'app-new-vehicle',
	templateUrl: './new-vehicle.component.html',
	styleUrls: [ './new-vehicle.component.scss' ]
})
export class NewVehicleComponent implements OnInit {
	form: FormGroup;
	isLoading = false;

	constructor(
		private router: Router,
		private flash: FlashService,
		private loading: NgxSpinnerService,
		private db: DbService,
		private fb: FormBuilder
	) {}

	ngOnInit(): void {
		// this.form = this.fb.group({
		// 	Manufacturer: [ this.data.manufacturerName, [ Validators.required ] ],
		// 	Model: [ this.data.modelName, [ Validators.required ] ],
		// 	Plate: [ this.data.plate, [ Validators.maxLength(7), Validators.required ] ],
		// 	Disc: [ this.data.discExpiry, [ Validators.required ] ],
		// 	SpecialNeeds: [ this.data.specialNeeds, [ Validators.required ] ]
		// });
	}

	specialNeeds: string[] = [ 'Yes', 'No' ];

	controlHasError(controlName: string, validation: string): boolean {
		let control = this.form.controls[controlName];
		if (!control) {
			return false;
		}
		return control.hasError(validation) && (control.dirty || control.touched);
	}

	validateForm() {
		const controls = this.form.controls;
		if (this.form.invalid) {
			Object.keys(controls).forEach((e) => controls[e].markAsTouched());

			return false;
		}
		return true;
	}

	submit() {
		if (this.validateForm()) {
			// console.log('In submit')
			let newVehicle: Vehicle = {
				manufacturerName: this.form.controls['Manufacturer'].value,
				modelName: this.form.controls['Model'].value,
				plate: this.form.controls['Plate'].value,
				discExpiry: this.form.controls['Disc'].value,
				specialNeeds: this.form.controls['SpecialNeeds'].value
			};

			this.isLoading = true;

			newVehicle.inUse = false;
			this.db
				.createVehicle(newVehicle)
				.then(() => {
					this.loading.hide();
				})
				.catch((e) => {
					this.loading.hide();
					this.flash.open(e.message, 'danger');
				});
		}
	}
}
