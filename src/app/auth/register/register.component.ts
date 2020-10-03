import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { AppState } from 'src/app/state/app.state';
import { AppInfo, IGNAddress } from 'src/app/models';
import { Observable } from 'rxjs';
import { Client } from 'src/app/models/client.model';
import { MatRadioChange } from '@angular/material/radio';
import { DbService } from 'src/app/services/db.service';
import { FlashService } from 'src/app/services/flash.service';
import { IGNUser } from 'src/app/models/user.model';
import { Company } from 'src/app/models/company.model';
import { Employee } from 'src/app/models/employee.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { nameValidator } from '../../services/validators/validators-index';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: [ './register.component.scss' ]
})
export class RegisterComponent implements OnInit {
	form: FormGroup;
	address: IGNAddress;
	clientForm: FormGroup;
	showPassword?: boolean = false;
	passwordMinLength: number = 6;
	gender: number;
	@Select(AppState.appInfo) appInfo$: Observable<AppInfo>;
	mapsOptions = {
		types: [],
		componentRestrictions: { country: 'ZA' }
	};

	constructor(
		private fb: FormBuilder,
		private db: DbService,
		private store: Store,
		private loading: NgxSpinnerService,
		private flash: FlashService,
		private authService: AuthService,
		private router: Router
	) {}

	togglePassword() {
		this.showPassword = !this.showPassword;
	}

	ngOnInit(): void {
		this.form = this.fb.group({
			email: [ '', [ Validators.required, Validators.email ] ],
			// phone: [
			// 	'',
			// 	[
			// 		Validators.required,
			// 		Validators.pattern('^[0-9]*$'),
			// 		Validators.maxLength(10),
			// 		Validators.minLength(10)
			// 	]
			// ],
			name: [ '', [ Validators.required, nameValidator ] ],

			password: [ '', [ Validators.required, Validators.minLength(this.passwordMinLength) ] ],
			companyName: [ '', [ Validators.required, Validators.minLength(3) ] ]
		});

		this.clientForm = this.fb.group({
			hasSpecialNeed: [ '', [ Validators.required ] ],
			address: [ '', [ Validators.required ] ],
			idnum: [
				'',
				[
					Validators.required,
					Validators.pattern('^[0-9]*$'),
					Validators.maxLength(13),
					Validators.minLength(13)
				]
			],
			gender: [ '', [ Validators.required ] ],
			name: [ '', [ Validators.required, nameValidator ] ],
			code: [ '', [ Validators.required, Validators.maxLength(8), Validators.minLength(8) ] ],
			phone: [
				'',
				[
					Validators.required,
					Validators.pattern('^[0-9]*$'),
					Validators.maxLength(10),
					Validators.minLength(10)
				]
			],
			email: [ '', [ Validators.required, Validators.email ] ],

			password: [ '', [ Validators.required, Validators.minLength(this.passwordMinLength) ] ]
		});

		// this.hasSpecialNeed.valueChanges.subscribe(checked => {
		//   console.log("value changed", checked);

		// });
	}

	specialNeedsChange(event: MatRadioChange) {
		console.log('special needs answer changed', event.value);
		if (event.value) {
			const validators = [ Validators.required ];
			this.clientForm.addControl('specialNeed', new FormControl('', validators));
		} else {
			this.clientForm.removeControl('specialNeed');
		}
		this.clientForm.updateValueAndValidity();
	}

	get hasSpecialNeed() {
		return this.clientForm.get('hasSpecialNeed') as FormControl;
	}

	get specialNeed() {
		return this.clientForm.get('specialNeed') as FormControl;
	}

	handleAddressChange(e) {
		this.address = {
			vicinity: e.vicinity,
			geometry: {
				lat: e.geometry.location.lat(),
				lng: e.geometry.location.lng()
			},
			name: e.name,
			id: e.id || '',
			url: e.url,
			formatted: e.formatted_address
		};
	}

	controlHasError(controlName: string, validation: string): boolean {
		let control = this.form.controls[controlName];
		if (!control) {
			return false;
		}
		return control.hasError(validation) && (control.dirty || control.touched);
	}

	clientControlHasError(controlName: string, validation: string): boolean {
		let control = this.clientForm.controls[controlName];
		if (!control) {
			return false;
		}
		return control.hasError(validation) && (control.dirty || control.touched);
	}

	validateClientForm() {
		const controls = this.clientForm.controls;
		if (this.clientForm.invalid) {
			Object.keys(controls).forEach((e) => controls[e].markAsTouched());

			return false;
		}

		return true;
	}

	validateForm() {
		const controls = this.form.controls;
		if (this.form.invalid) {
			Object.keys(controls).forEach((e) => controls[e].markAsTouched());

			return false;
		}

		return true;
	}

	getLastname(): string {
		if (this.form.controls.name.value.split(' ').length > 2) {
			return this.form.controls.name.value.split(' ')[2];
		} else {
			return this.form.controls.name.value.split(' ')[1];
		}
	}

	submit() {
		console.log('submitting');

		if (this.validateForm()) {
			// check if email already exists
			this.loading.show();
			this.db.emailExists(this.form.controls['email'].value).then((exists) => {
				if (exists) {
					this.loading.hide();
					this.flash.open('A user with that email address already exists', 'info');
				} else {
					let info: AppInfo = this.store.snapshot().app.appInfo;
					const name: string = this.form.controls['name'].value;
					let data: { password: string; user: IGNUser; company: Company } = {
						company: {
							name: this.form.controls['companyName'].value,
							workingHours: info.workingHours,
							empTypes: info.empTypes,
							paymentTypes: info.paymentTypes,
							serviceItems: [],
							setup: false
						},
						user: {
							email: this.form.controls['email'].value,
							name: name,
							firstname: name.split(' ')[0],
							lastname: name.split(' ')[1],
							imageUrl: info.avatar,
							userType: 1,
							empType: '0'
						},
						password: this.form.controls['password'].value
					};
					this.authService.signUpEmpWithEmail(data);
				}
			});
		} else {
			console.log('form invalid');
		}
	}

	submitClient() {
		console.log('submitting clients');
		if (this.validateClientForm()) {

			let info: AppInfo = this.store.snapshot().app.appInfo;
			let company: Company = this.store.snapshot().app.company;
			const name: string = this.clientForm.controls['name'].value;
			const hasSpecialNeed: boolean = this.clientForm.controls['hasSpecialNeed'].value;
			let data: { user: Client; password: string } = {
				password: this.clientForm.controls['password'].value,
				user: {
					name: name,
					companyID: null,
					email: this.clientForm.controls['email'].value,
					gender: this.clientForm.controls['gender'].value,
					IDNum: this.clientForm.controls['idnum'].value,
					firstname: name.split(' ')[0],
					lastname: name.split(' ')[1],
					phone: this.clientForm.controls['phone'].value,
					specialNeed: !hasSpecialNeed ? null : this.clientForm.controls['specialNeed'].value,
					address: this.address,
					isActive: true,
					hasSpecialNeed,
					imageUrl: info.avatar,
					setup: false,
					userType: 0,
          empType: '-1',
          balance: 0
				}
			};
			this.loading.show();
			this.db.emailExists(this.clientForm.controls['email'].value).then((val) => {
				if (!val) {
					this.db.idNumExists(this.clientForm.controls['idnum'].value).then((val2) => {
						if (!val2) {
							this.db.phoneExists(this.clientForm.controls['phone'].value).then((val3) => {
								if (!val3) {
									this.db
										.getCompanyFromCode(this.clientForm.controls['code'].value)
										.then((comp) => {
											console.log('company ', comp);
                      data.user.companyID = comp.id;
                     this.db.client.companyID = comp.id
											this.authService.signUpClientWithEmail(data);
										})
										.catch((e) => {
											this.loading.hide();
											this.flash.open(e.message, 'danger');
										});
								} else {
									this.loading.hide();
									this.flash.open('A user with that Phone number already exists', 'danger');
								}
							});
						} else {
							this.loading.hide();
							this.flash.open('A user with that ID number already exists', 'danger');
						}
					});
				} else {
					this.loading.hide();
					this.flash.open('A user with that email already exists', 'danger');
				}
			});
		} else {
			console.log('invalid form');
		}
	}
}
