import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IGNPackage } from 'src/app/models/package.model';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
	selector: 'app-update',
	templateUrl: './update.component.html',
	styleUrls: [ './update.component.scss' ]
})
export class UpdateComponent implements OnInit {
	form: FormGroup;
	isLoading = false;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: IGNPackage,
		private dialogRef: MatDialogRef<UpdateComponent>,
		private fb: FormBuilder
	) {}

	ngOnInit(): void {
		console.log('our data', this.data);
		this.form = this.fb.group({
			name: [ this.data.name, [] ],
			description: [ this.data.desc, [] ],
			price: [ this.data.price, [] ]
		});
	}

	close() {
		this.dialogRef.close('this is the return data');
	}

	submit() {
		let newPackage: IGNPackage = {
			name: this.form.controls['name'].value,
			desc: this.form.controls['description'].value,
			price: this.data.price
		};
		// database operation
		this.isLoading = true;
		setTimeout(() => {
			this.dialogRef.close(newPackage);
		}, 5000);
	}
}
