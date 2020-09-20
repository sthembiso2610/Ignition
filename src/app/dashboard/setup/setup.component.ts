import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, Select } from '@ngxs/store';
import { AppInfo, Hour, WorkDay } from 'src/app/models';
import { AppState } from 'src/app/state/app.state';
import { Subscription, Observable } from 'rxjs';
import { FlashService } from '../../services/flash.service';
import { DbService } from 'src/app/services/db.service';
import { data } from '../../shared/data';
import { Company } from 'src/app/models/company.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
	selector: 'app-setup',
	templateUrl: './setup.component.html',
	styleUrls: [ './setup.component.scss' ]
})
export class SetupComponent implements OnInit, OnDestroy {
	isLinear: boolean = true;
	step1Form: FormGroup;
	step2Form: FormGroup;
	step3Form: FormGroup;
	appInfo: AppInfo;
	unsubscribe: Subscription[] = [];
	innerWidth = 0;
	forms: FormGroup[] = new Array(7);
	hours: Hour[] = data.hours;
	init: boolean = false;
	companyInit: boolean = false;
	@Select(AppState.appInfo) appInfo$: Observable<AppInfo>;
	@Select(AppState.company) company$: Observable<Company>;

	constructor(
		private fb: FormBuilder,
		private loading: NgxSpinnerService,
		private router: Router,
		private store: Store,
		private flash: FlashService,
		private db: DbService
	) {
		this.forms.fill(
			fb.group({
				open: [ '' ],
				close: [ '' ]
			})
		);
		this.innerWidth = window.innerWidth;
		this.loading.show();
		const sub = this.appInfo$.subscribe((data) => {
			if (data.workingHours.length > 0 && !this.init) {
				for (let index = 0; index < this.forms.length; index++) {
					const day: WorkDay = data.workingHours.find((e) => e.day === index + 1);
					console.log('day', day);
					this.forms[index] = this.fb.group({
						open: [ day.hours.open, [ Validators.required ] ],
						close: [ day.hours.close, [ Validators.required ] ]
					});
				}
				console.log('hiding');
				this.init = true;
				this.loading.hide();
			}
		});
		this.unsubscribe.push(sub);
	}

	ngOnInit(): void {
		this.step1Form = this.fb.group({
			code: [ '', [] ],
			name: [ '', [ Validators.required ] ],
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
			rate: [ '', [ Validators.required, Validators.pattern('^[0-9]+([,.][0-9]+)?$') ] ]
		});
		this.step1Form.controls['code'].disable();

		const sub1 = this.company$.subscribe((data) => {
			if (data.name != '' && !this.companyInit) {
				this.step1Form.controls['code'].setValue(data.code);
				this.step1Form.controls['name'].setValue(data.name);
				this.step1Form.controls['email'].setValue(data.email);
				this.step1Form.controls['phone'].setValue(data.phone);
				this.step1Form.controls['rate'].setValue(data.rate);
				this.companyInit = true;
			}
		});
		this.unsubscribe.push(sub1);
	}

	get isMobile() {
		return this.innerWidth <= 768;
	}

	submitHours(index: number) {
		const controls = this.forms[index].controls;

		// check forms[index]
		if (this.forms[index].invalid) {
			Object.keys(controls).forEach((controlName) => controls[controlName].markAsTouched());
			return;
		}
		this.loading.show();

		this.db
			.updateWorkHour(index + 1, {
				open: Number(this.forms[index].controls.open.value),
				close: Number(this.forms[index].controls.close.value)
			})
			.then(() => {
				this.loading.hide();
				this.flash.open('Hours updated', 'success');
			})
			.catch((e) => {
				this.loading.hide();
				this.flash.open(e.message, 'danger');
			});
	}

	slideToggle(e, index: number) {
		this.loading.show();
		this.db
			.toggleWorkHour(index, e.checked)
			.then(() => {
				this.loading.hide();
				// this.flash.open()
			})
			.catch((e) => {
				this.loading.hide();
				this.flash.open(e.message, 'danger');
			});
	}

	step1ControlHasError(controlName: string, validation: string): boolean {
		let control = this.step1Form.controls[controlName];
		if (!control) {
			return false;
		}
		return control.hasError(validation) && (control.dirty || control.touched);
	}

	step2ControlHasError(controlName: string, validation: string): boolean {
		let control = this.step2Form.controls[controlName];
		if (!control) {
			return false;
		}
		return control.hasError(validation) && (control.dirty || control.touched);
	}

	step3ControlHasError(controlName: string, validation: string): boolean {
		let control = this.step3Form.controls[controlName];
		if (!control) {
			return false;
		}
		return control.hasError(validation) && (control.dirty || control.touched);
	}

	ngOnDestroy() {
		this.unsubscribe.forEach((e) => {
			if (!e.closed) {
				e.unsubscribe();
			}
		});
	}

	@HostListener('window:resize', [ '$event' ])
	resize(e) {
		this.innerWidth = window.innerWidth;
	}

	validateStep1() {
		const controls = this.step1Form.controls;
		if (this.step1Form.invalid) {
			Object.keys(controls).forEach((e) => controls[e].markAsTouched());

			return false;
		}

		return true;
	}

	submitStep1() {
		if (this.validateStep1()) {
			console.log('valid');
		} else {
			console.log('not valid');
		}
	}

	submit() {
		this.loading.show();
		this.db
			.updateCompany({
				phone: this.step1Form.controls['phone'].value,
				setup: true,
				email: this.step1Form.controls['email'].value,
				name: this.step1Form.controls['name'].value,
				rate: Number(this.step1Form.controls['rate'].value)
			})
			.then(() => {
				this.loading.hide();
				this.router.navigate([ '/dashboard/staff' ]);
			})
			.catch((e) => {
				this.loading.hide();
				this.flash.open(e.message, 'danger');
			});
	}
}
