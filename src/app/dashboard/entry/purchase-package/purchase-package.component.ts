import { Component, OnInit, Inject } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { AppState } from 'src/app/state/app.state';
import { Observable } from 'rxjs';
import { Company } from 'src/app/models/company.model';
import { AppInfo } from 'src/app/models';
import { IGNUser } from 'src/app/models/user.model';
import { DialogService } from 'src/app/services/dialog.service';
import { Router } from '@angular/router';
import { FlashService } from 'src/app/services/flash.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DbService } from 'src/app/services/db.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IGNPackage } from 'src/app/models/package.model';
import { IGNTransaction } from 'src/app/models/transaction.model';
import { map } from 'rxjs/operators';

@Component({
	selector: 'app-purchase-package',
	templateUrl: './purchase-package.component.html',
	styleUrls: [ './purchase-package.component.scss' ]
})
export class PurchasePackageComponent implements OnInit {
	@Select(AppState.company) company$: Observable<Company>;
	@Select(AppState.appInfo) appInfo$: Observable<AppInfo>;
	@Select(AppState.packages) packages$: Observable<IGNPackage[]>;
	@Select(AppState.user) user$: Observable<IGNUser>;
	form: FormGroup;
	transactions: IGNTransaction[] = [];

	constructor(
		private store: Store,
		private fb: FormBuilder,
		private dialogRef: MatDialogRef<PurchasePackageComponent>,
		@Inject(MAT_DIALOG_DATA) private inputData: IGNUser,
		private dialog: DialogService,
		private router: Router,
		private flash: FlashService,
		private loading: NgxSpinnerService,
		private db: DbService
	) {
		console.log('user', this.inputData);
		this.form = fb.group({
			package: [ '', [ Validators.required ] ]
		});

		const sub = this.store
			.select(AppState.userTransactions)
			.pipe(map((filterFn) => filterFn(inputData.uid)))
			.subscribe((data) => {
				this.transactions = data;
			});
	}

	get balance(): number {
		return this.transactions.reduce((prev, current, index) => {
			if (current.type == 0) {
				return prev + current.amount;
			} else {
				return prev - current.amount;
			}
		}, 0);
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
			let item: IGNPackage = this.form.controls['package'].value;
			if (this.balance >= item.price) {
				this.loading.show();
				let transaction: IGNTransaction = {
					type: 0,
					paymentType: '0',
					uid: this.inputData.uid,
					amount: item.price,
					createdAt: new Date(Date.now())
				};
				this.db
					.purchasePackage(this.inputData.uid, item, transaction)
					.then(() => {
						this.loading.hide();
						this.close();
					})
					.catch((e) => {
						this.loading.hide();
						this.flash.open(e.message, 'danger');
					});
			} else {
				this.flash.open('Insufficient balance for this purchase, please top up', 'danger');
			}
		}
	}

	ngOnInit(): void {}
}
