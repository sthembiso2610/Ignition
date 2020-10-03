import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DialogService } from 'src/app/services/dialog.service';
import { Router } from '@angular/router';
import { FlashService } from 'src/app/services/flash.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DbService } from 'src/app/services/db.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PurchasePackageComponent } from '../purchase-package/purchase-package.component';
import { IGNUser } from 'src/app/models/user.model';
import { Select } from '@ngxs/store';
import { AppState } from 'src/app/state/app.state';
import { Observable } from 'rxjs';
import { Company } from 'src/app/models/company.model';
import { AppInfo } from 'src/app/models';
import { IGNTransaction } from 'src/app/models/transaction.model';

@Component({
	selector: 'app-topup',
	templateUrl: './topup.component.html',
	styleUrls: [ './topup.component.scss' ]
})
export class TopupComponent implements OnInit {
	form: FormGroup;
	@Select(AppState.company) company$: Observable<Company>;
	@Select(AppState.appInfo) appInfo$: Observable<AppInfo>;
	@Select(AppState.user) user$: Observable<IGNUser>;

	constructor(
		private dialogRef: MatDialogRef<PurchasePackageComponent>,
		@Inject(MAT_DIALOG_DATA) private inputData: IGNUser,
		private fb: FormBuilder,
		private dialog: DialogService,
		private router: Router,
		private flash: FlashService,
		private loading: NgxSpinnerService,
		private db: DbService
	) {
		this.form = fb.group({
			amount: [ '', [ Validators.required, Validators.pattern('^[0-9]+([,.][0-9]+)?$') ] ],
			type: [ '', [ Validators.required ] ]
		});
	}

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

	get description(): string {
		return `Purchase package: ${this.inputData.name}`;
	}

	close() {
		this.dialogRef.close();
	}

	submit() {
		if (this.validateForm()) {
			this.loading.show();
			const transaction: IGNTransaction = {
				createdAt: new Date(Date.now()),
				amount: Number(this.form.controls['amount'].value),
				type: 1,
				paymentType: this.form.controls['type'].value,
				uid: this.inputData.uid
      };
      this.db.UpdateBalance(this.inputData, transaction.amount)

			this.db
				.createTransaction(transaction)
				.then(() => {
					this.loading.hide();
					this.close();
				})
				.catch((e) => {
					this.loading.hide();
					this.flash.open(e.message, 'danger');
				});
		}
	}

	ngOnInit(): void {}
}
