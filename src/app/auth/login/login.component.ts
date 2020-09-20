import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FlashService } from 'src/app/services/flash.service';
import { DbService } from 'src/app/services/db.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: [ './login.component.scss' ]
})
export class LoginComponent implements OnInit {
	form: FormGroup;
	clientForm: FormGroup;
	showPassword: boolean = false;
	passwordMinLength = 6;

	constructor(
		private router: Router,
		private afAuth: AngularFireAuth,
		private db: DbService,
		private loading: NgxSpinnerService,
		private flash: FlashService,
		private fb: FormBuilder,
		private authService: AuthService
	) {}

	ngOnInit(): void {
		this.form = this.fb.group({
			email: [ '', [ Validators.required, Validators.email ] ],
			password: [ '', [ Validators.required, Validators.minLength(this.passwordMinLength) ] ]
		});

		this.clientForm = this.fb.group({
			email: [ '', [ Validators.required, Validators.email ] ],
			password: [ '', [ Validators.required, Validators.minLength(this.passwordMinLength) ] ]
		});
	}

	controlHasError(controlName: string, validation: string): boolean {
		let control = this.form.controls[controlName];
		if (!control) {
			return false;
		}
		return control.hasError(validation) && (control.dirty || control.touched);
	}

	clientControlHasError(controlName: string, validation: string): boolean {
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

	validateClientForm() {
		const controls = this.form.controls;
		if (this.form.invalid) {
			Object.keys(controls).forEach((e) => controls[e].markAsTouched());

			return false;
		}

		return true;
	}

	submit() {
		if (this.validateForm()) {
			this.loading.show();
			this.authService
				.signIn({
					password: this.form.controls['password'].value,
					email: this.form.controls['email'].value
				})
				.then((cred) => {
					this.db
						.userIsActive(cred.user.uid)
						.then((active) => {
							this.loading.hide();
							if (active) {
								this.router.navigate([ '/dashboard' ]);
							} else {
								this.flash.open(
									'User deactivated by admin. Contact your administrator if this is a mistake',
									'danger'
								);
								this.afAuth.signOut();
							}
						})
						.catch((e) => {
							this.loading.hide();
							this.flash.open(e.message, 'danger');
						});
				})
				.catch((e) => {
					this.loading.hide();
					this.flash.open(e.message, 'danger');
				});
		}
	}

	clientSubmit() {
		if (this.validateClientForm()) {
			let name: string = this.clientForm.controls['name'].value;
			let email: string = this.clientForm.controls['email'].value;

			this.authService;
		}
	}
}
