import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogService } from 'src/app/services/dialog.service';
import { Router } from '@angular/router';
import { FlashService } from 'src/app/services/flash.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DbService } from 'src/app/services/db.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: [ './reset-password.component.scss' ]
})
export class ResetPasswordComponent implements OnInit {
	form: FormGroup;
	@ViewChild('formDir') formDir;

	constructor(
		private fb: FormBuilder,
		private auth: AuthService,
		private dialog: DialogService,
		private router: Router,
		private flash: FlashService,
		private loading: NgxSpinnerService,
		private db: DbService
	) {}

	ngOnInit(): void {
		this.form = this.fb.group({
			email: [ '', [ Validators.required, Validators.email ] ]
		});
	}

	validateForm() {
		const controls = this.form.controls;
		if (this.form.invalid) {
			Object.keys(controls).forEach((e) => controls[e].markAsTouched());

			return false;
		}

		return true;
	}

	markFormAsPristine() {
		this.form.markAsPristine();
	}

	controlHasError(controlName: string, validation: string): boolean {
		let control = this.form.controls[controlName];
		if (!control) {
			return false;
		}
		return control.hasError(validation) && (control.dirty || control.touched);
	}

	submit() {
		if (this.validateForm()) {
			this.loading.show();
			this.auth
				.sendresetEmail(this.form.controls['email'].value)
				.then(() => {
					this.formDir.resetForm();
					this.loading.hide();
					this.dialog.success('Please check your email and follow the link to reset password');
				})
				.catch((e) => {
					this.loading.hide();
					this.flash.open(e.message, 'danger');
				});
		}
	}
}
