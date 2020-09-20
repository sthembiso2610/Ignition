import { Component, OnInit, OnDestroy } from '@angular/core';
import { IGNUser } from 'src/app/models/user.model';
import { Store, Select } from '@ngxs/store';
import { DialogService } from 'src/app/services/dialog.service';
import { Router } from '@angular/router';
import { FlashService } from 'src/app/services/flash.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DbService } from 'src/app/services/db.service';
import { finalize } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { nameValidator } from 'src/app/services/validators/validators-index';
import { MatRadioChange } from '@angular/material/radio';
import { IGNAddress, AppInfo } from 'src/app/models';
import { AppState } from 'src/app/state/app.state';
import { Company } from 'src/app/models/company.model';
import { ClientLicenceRecord } from 'src/app/models/clientLicenceRecord.model';
import { LicenceCode } from 'src/app/models/LicenceCode.model';
import { EmergencyContact } from 'src/app/models/emergencyContact.model';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: [ './profile.component.scss' ]
})
export class ProfileComponent implements OnInit, OnDestroy {
	// Main task
	task: AngularFireUploadTask;
	form: FormGroup;
	contactForm: FormGroup;
	address: IGNAddress;
	localUser: IGNUser;
	init: boolean = false;
	unsubscribe: Subscription[] = [];
	recordInit: boolean = false;
	mapsOptions = {
		types: [],
		componentRestrictions: { country: 'ZA' }
	};
	@Select(AppState.company) company$: Observable<Company>;
	@Select(AppState.appInfo) appInfo$: Observable<AppInfo>;
	@Select(AppState.user) user$: Observable<IGNUser>;
	@Select(AppState.licencerecord) licencerecord$: Observable<ClientLicenceRecord>;
	@Select(AppState.licenceCodes) licenceCodes$: Observable<LicenceCode[]>;

	// Progress monitoring
	percentage: Observable<number>;

	snapshot: Observable<any>;
	filename: string;
	fileref: string;

	constructor(
		private store: Store,
		private storage: AngularFireStorage,
		private dialog: DialogService,
		private router: Router,
		private fb: FormBuilder,
		private flash: FlashService,
		private loading: NgxSpinnerService,
		private db: DbService
	) {}

	ngOnInit(): void {
		this.form = this.fb.group({
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
				this.init = true;
				this.localUser = data;
				(this.address = data.address), this.form.controls['name'].setValue(data.name);
				this.form.controls['email'].setValue(data.email);
				this.form.controls['phone'].setValue(data.phone);
				this.form.controls['idnum'].setValue(data.IDNum);
				this.form.controls['gender'].setValue(data.gender);
				if (data.address != undefined) {
					this.form.controls['address'].setValue(data.address.formatted);
				}

				if (data.userType == 0) {
					this.form.controls['hasSpecialNeed'].setValue(data.hasSpecialNeed);
				} else {
					console.log('clearing validators');
					this.form.controls['hasSpecialNeed'].clearValidators();
					this.form.controls['hasSpecialNeed'].updateValueAndValidity();
					this.form.controls['idnum'].clearValidators();
					this.form.controls['idnum'].updateValueAndValidity();
				}

				// contact form
				if (data.contact != undefined && data.contact != null) {
					this.contactForm.controls['name'].setValue(data.contact.name);
					this.contactForm.controls['email'].setValue(data.contact.email);
					this.contactForm.controls['phone'].setValue(data.contact.phone);
					this.contactForm.controls['relation'].setValue(data.contact.relation);
				}
			}
		});

		this.unsubscribe.push(sub);
	}

	specialNeedsChange(event: MatRadioChange) {
		console.log('special needs answer changed', event.value);
		if (event.value) {
			const validators = [ Validators.required ];
			this.contactForm.addControl('specialNeed', new FormControl('', validators));
		} else {
			this.contactForm.removeControl('specialNeed');
		}
		this.contactForm.updateValueAndValidity();
	}

	get hasSpecialNeed() {
		return this.contactForm.get('hasSpecialNeed') as FormControl;
	}

	get specialNeed() {
		return this.contactForm.get('specialNeed') as FormControl;
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

	validateContactForm() {
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
		if (this.validateForm()) {
			const usr: IGNUser = this.store.snapshot().app.user;
			const hasSpecialNeed: boolean = this.form.controls['hasSpecialNeed'].value;
			const name: string = this.form.controls['name'].value;
			const user: IGNUser = {
				name: name,
				uid: this.localUser.uid,
				email: this.form.controls['email'].value,
				gender: this.form.controls['gender'].value,
				IDNum: this.form.controls['idnum'].value || '',
				firstname: name.split(' ')[0],
				lastname: name.split(' ')[1],
				phone: this.form.controls['phone'].value,
				hasSpecialNeed,
				specialNeed: !hasSpecialNeed ? null : this.form.controls['specialNeed'].value,
				address: this.address,
				isActive: true,
				setup: true
			};

			this.updateProfile(user);
		} else {
			console.log('form invalid');
		}
	}

	submitContact() {
		if (this.validateContactForm()) {
			let name: string = this.contactForm.controls['name'].value;
			const contact: EmergencyContact = {
				name: name,
				firstname: name.split(' ')[0],
				lastname: name.split(' ')[1],
				relation: this.contactForm.controls['relation'].value,
				phone: this.contactForm.controls['phone'].value,
				email: this.contactForm.controls['email'].value
			};

			this.updateProfile({
				contact
			});
		}
	}

	async startUpload(event: FileList) {
		const user: IGNUser = this.store.snapshot().app.user;
		// The File object
		const file = event.item(0);
		if (!file.type.includes('image')) {
			this.flash.open('Please make sure your file is an image', 'danger');
			return;
		}

		// The storage path
		const path = `files/${user.uid}/${new Date().getTime()}_${file.name}`;
		this.filename = file.name;
		this.fileref = path;
		const fileRef = this.storage.ref(path);
		// Totally optional metadata
		const customMetadata = { app: 'Angular PWA' };

		// The main task
		this.task = this.storage.upload(path, file, { customMetadata });

		// Progress monitoring
		this.percentage = this.task.percentageChanges();
		this.snapshot = this.task.snapshotChanges();

		// The file's download URL
		this.task
			.snapshotChanges()
			.pipe(
				finalize(() => {
					fileRef.getDownloadURL().subscribe((url) => {
						this.updateProfile({
							imageUrl: url
						});
					});
				})
			)
			.subscribe();
	}

	ngOnDestroy(): void {
		this.unsubscribe.forEach((e) => {
			if (!e.closed) {
				e.unsubscribe();
			}
		});
	}

	updateProfile(update) {
		this.loading.show();
		this.db
			.updateProfile(update)
			.then(() => {
				this.loading.hide();
				this.flash.open('profile updated', 'success');
			})
			.catch((e) => {
				this.loading.hide();
				this.flash.open(e.message, 'danger');
			});
	}
}
