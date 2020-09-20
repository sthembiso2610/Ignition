import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FlashService } from 'src/app/services/flash.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmployeeType } from 'src/app/models/employeeType.model';
import { DbService } from 'src/app/services/db.service';
import { Select, Store } from '@ngxs/store';
import { AppState } from 'src/app/state/app.state';
import { Observable, Subscription } from 'rxjs';
import { Company } from 'src/app/models/company.model';
import { AppInfo } from 'src/app/models';
import { map, tap, take } from 'rxjs/operators';
import { LicenceCode, ActionPlanItem } from 'src/app/models/LicenceCode.model';

@Component({
	selector: 'app-new-licence-code',
	templateUrl: './new-licence-code.component.html',
	styleUrls: [ './new-licence-code.component.scss' ]
})
export class NewLicenceCodeComponent implements OnInit, OnDestroy {
	form: FormGroup;
	id: string;
	licenceCode: LicenceCode;
	unsubscribe: Subscription[] = [];
	init: boolean = false;
	selectedItems: string[] = [];

	@Select(AppState.company) company$: Observable<Company>;
	@Select(AppState.appInfo) appInfo$: Observable<AppInfo>;

	constructor(
		private fb: FormBuilder,
		private flash: FlashService,
		private store: Store,
		private route: ActivatedRoute,
		private router: Router,
		private db: DbService,
		private loading: NgxSpinnerService
	) {
		this.form = this.fb.group({
			name: [ '', [ Validators.required ] ],
			desc: [ '', [ Validators.required ] ]
		});

		this.route.paramMap.subscribe((params) => {
			if (params.get('id')) {
				this.id = params.get('id');
				const sub = this.store
					.select(AppState.licenceCode)
					.pipe(map((filterFn) => filterFn(this.id)))
					.subscribe((val) => {
						if (val.name != '' && !this.init) {
							this.init = true;
							this.licenceCode = val;
							this.form.controls['name'].setValue(val.name);
							this.form.controls['desc'].setValue(val.desc);
							this.selectedItems = val.planItems || [];
						}
					});
				this.unsubscribe.push(sub);
			} else {
				console.log('no id');
			}
		});
	}

	get isEditing() {
		return this.id != null && this.id != '';
	}

	ngOnInit(): void {}

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
			const code: LicenceCode = {
				name: this.form.controls['name'].value,
				planItems: this.selectedItems,
				desc: this.form.controls['desc'].value
			};
			this.loading.show();
			let p: Promise<any>;
			if (this.isEditing) {
				code.id = this.id;
				p = this.db.updateLicenceCode(code);
			} else {
				p = this.db.createLicenceCode(code);
			}
			p
				.then(() => {
					this.loading.hide();
					this.router.navigate([ '/dashboard/licence/all' ]);
				})
				.catch((e) => {
					this.loading.hide();
					this.flash.open(e.message, 'danger');
				});
		}
	}

	ngOnDestroy() {
		this.unsubscribe.forEach((e) => {
			if (!e.closed) {
				e.unsubscribe();
			}
		});
	}
}
