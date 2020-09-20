import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DialogService } from 'src/app/services/dialog.service';
import { Router } from '@angular/router';
import { FlashService } from 'src/app/services/flash.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DbService } from 'src/app/services/db.service';
import { nameValidator } from 'src/app/services/validators/validators-index';
import { IGNAddress, AppInfo } from 'src/app/models';
import { Select, Store } from '@ngxs/store';
import { AppState } from 'src/app/state/app.state';
import { Observable, Subscription } from 'rxjs';
import { Company } from 'src/app/models/company.model';
import { EmergencyContact } from 'src/app/models/emergencyContact.model';
import { IGNUser } from 'src/app/models/user.model';
import { MatRadioChange } from '@angular/material/radio';
import { LicenceCode } from 'src/app/models/LicenceCode.model';
import { ClientLicenceRecord } from 'src/app/models/clientLicenceRecord.model';

@Component({
	selector: 'app-client-setup',
	templateUrl: './client-setup.component.html',
	styleUrls: [ './client-setup.component.scss' ]
})
export class ClientSetupComponent implements OnInit, OnDestroy {
	form: FormGroup;
	passwordMinLength: number = 6;
	contactForm: FormGroup;
	address: IGNAddress;
	showPassword: boolean = false;
	mapsOptions = {
		types: [],
		componentRestrictions: { country: 'ZA' }
	};
	unsubscribe: Subscription[] = [];
	init: boolean = false;
	recordInit: boolean = false;

	@Select(AppState.company) company$: Observable<Company>;
	@Select(AppState.appInfo) appInfo$: Observable<AppInfo>;
	@Select(AppState.user) user$: Observable<IGNUser>;
	@Select(AppState.licencerecord) licencerecord$: Observable<ClientLicenceRecord>;
	@Select(AppState.licenceCodes) licenceCodes$: Observable<LicenceCode[]>;

	localUser: IGNUser;

	constructor(
		private fb: FormBuilder,
		private store: Store,
		private dialog: DialogService,
		private router: Router,
		private flash: FlashService,
		private loading: NgxSpinnerService,
		private db: DbService
	) {}

	ngOnInit(): void {
		this.form = this.fb.group({
			hasSpecialNeed: [ '', [ Validators.required ] ],
			address: [ '', [ Validators.required ] ],
			code: [ '', [ Validators.required ] ],
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
			phone: [
				'',
				[
					Validators.required,
					Validators.pattern('^[0-9]*$'),
					Validators.maxLength(10),
					Validators.minLength(10)
				]
			],
			email: [ '', [ Validators.required, Validators.email ] ]
		});

		this.contactForm = this.fb.group({
			relation: [ '', [ Validators.required ] ],
			name: [ '', [ Validators.required, nameValidator ] ],
			phone: [
				'',
				[
					Validators.required,
					Validators.pattern('^[0-9]*$'),
					Validators.maxLength(10),
					Validators.minLength(10)
				]
			],
			email: [ '', [ Validators.email ] ]
		});

		const sub = this.user$.subscribe((data) => {
			if (data.name != '' && !this.init) {
				this.localUser = data;
				console.log('data', data);
				this.address = data.address;
				this.form.controls['name'].setValue(data.name);
				this.form.controls['email'].setValue(data.email);
				this.form.controls['phone'].setValue(data.phone);
				this.form.controls['idnum'].setValue(data.IDNum);
				this.form.controls['gender'].setValue(data.gender),
					this.form.controls['address'].setValue(data.address.formatted);
				this.form.controls['hasSpecialNeed'].setValue(data.hasSpecialNeed);

				// contact form
				if (data.contact != undefined && data.contact != null) {
					this.contactForm.controls['name'].setValue(data.contact.name);
					this.contactForm.controls['email'].setValue(data.contact.email);
					this.contactForm.controls['phone'].setValue(data.contact.phone);
					this.contactForm.controls['relation'].setValue(data.contact.relation);
				}
				this.init = true;
			}
		});

		this.unsubscribe.push(sub);

		const sub1 = this.licencerecord$.subscribe((data) => {
			if (data.id != '' && !this.recordInit) {
				this.form.controls['code'].setValue(data.licenceCode);
				this.recordInit = true;
			}
		});
		this.unsubscribe.push(sub1);
	}

	specialNeedsChange(event: MatRadioChange) {
		console.log('special needs answer changed', event.value);
		if (event.value) {
			const validators = [ Validators.required ];
			this.form.addControl('specialNeed', new FormControl('', validators));
		} else {
			this.form.removeControl('specialNeed');
		}
		this.form.updateValueAndValidity();
	}

	togglePassword() {
		this.showPassword = !this.showPassword;
	}

	get hasSpecialNeed() {
		return this.form.get('hasSpecialNeed') as FormControl;
	}

	get specialNeed() {
		return this.form.get('specialNeed') as FormControl;
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

	contactControlHasError(controlName: string, validation: string): boolean {
		let control = this.contactForm.controls[controlName];
		if (!control) {
			return false;
		}
		return control.hasError(validation) && (control.dirty || control.touched);
	}

	validatecontactForm() {
		const controls = this.contactForm.controls;
		if (this.contactForm.invalid) {
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

	submit() {
		if (this.validateForm() && this.validatecontactForm()) {
			this.loading.show();
			let info: AppInfo = this.store.snapshot().app.appInfo;
			let company: Company = this.store.snapshot().app.company;
			const contactName: string = this.contactForm.controls['name'].value;
			const name: string = this.form.controls['name'].value;
			const hasSpecialNeed: boolean = this.form.controls['hasSpecialNeed'].value;
			const contact: EmergencyContact = {
				name: contactName,
				firstname: contactName.split(' ')[0],
				lastname: contactName.split(' ')[1],
				relation: this.contactForm.controls['relation'].value,
				phone: this.contactForm.controls['phone'].value,
				email: this.contactForm.controls['email'].value
			};

			const user: IGNUser = {
				name: name,
				uid: this.localUser.uid,
				email: this.form.controls['email'].value,
				gender: this.form.controls['gender'].value,
				IDNum: this.form.controls['idnum'].value,
				firstname: name.split(' ')[0],
				lastname: name.split(' ')[1],
				phone: this.form.controls['phone'].value,
				hasSpecialNeed,
				specialNeed: !hasSpecialNeed ? null : this.form.controls['specialNeed'].value,
				address: this.address,
				isActive: true,
				imageUrl: info.avatar,
				companyID: company.id,
				setup: true,
				contact: contact,
				userType: 0,
				empType: '-1'
			};

			this.db
				.clientSetup({ user, licenceCode: this.form.controls['code'].value })
				.then(() => {
					this.loading.hide();
					this.router.navigate([ '/dashboard/calendar' ]);
				})
				.catch((e) => {
					this.loading.hide();
					this.flash.open(e.message, 'danger');
				});
		}
	}

	ngOnDestroy(): void {
		this.unsubscribe.forEach((e) => {
			if (!e.closed) {
				e.unsubscribe();
			}
		});
	}
}
