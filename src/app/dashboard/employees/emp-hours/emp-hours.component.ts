import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Hour, WorkDay, AppInfo } from 'src/app/models';
import { data } from 'src/app/shared/data';
import { DialogService } from 'src/app/services/dialog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashService } from 'src/app/services/flash.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DbService } from 'src/app/services/db.service';
import { Subscription, Observable } from 'rxjs';
import { AppState } from 'src/app/state/app.state';
import { map } from 'rxjs/operators';
import { Store, Select } from '@ngxs/store';
import { Company } from 'src/app/models/company.model';
import { IGNUser } from 'src/app/models/user.model';
import { Employee } from 'src/app/models/employee.model';

@Component({
	selector: 'app-emp-hours',
	templateUrl: './emp-hours.component.html',
	styleUrls: [ './emp-hours.component.scss' ]
})
export class EmpHoursComponent implements OnInit, OnDestroy {
	forms: FormGroup[] = new Array(7);
	hours: Hour[] = data.hours;
	init: boolean = false;
	uid: string;
	unsubscribe: Subscription[] = [];
	@Select(AppState.company) company$: Observable<Company>;
	@Select(AppState.appInfo) appInfo$: Observable<AppInfo>;
	@Select(AppState.user) user$: Observable<IGNUser>;
	emp: Employee = {
		workingHours: []
	};

	constructor(
		private route: ActivatedRoute,
		private store: Store,
		private fb: FormBuilder,
		private dialog: DialogService,
		private router: Router,
		private flash: FlashService,
		private loading: NgxSpinnerService,
		private db: DbService
	) {
		this.forms.fill(
			fb.group({
				open: [ '' ],
				close: [ '' ]
			})
		);
		const sub = this.route.paramMap.subscribe((params) => {
			if (params.get('id')) {
				this.loading.show();
				this.uid = params.get('id');
				const sub = this.store
					.select(AppState.employee)
					.pipe(map((filterFn) => filterFn(this.uid)))
					.subscribe((val) => {
						if (val.name != '' && !this.init) {
							this.init = true;
							for (let index = 0; index < this.forms.length; index++) {
								const day: WorkDay = val.workingHours.find((e) => e.day === index + 1);
								console.log('day', day);
								this.forms[index] = this.fb.group({
									open: [ day.hours.open, [ Validators.required ] ],
									close: [ day.hours.close, [ Validators.required ] ]
								});
							}
							this.init = true;
							this.loading.hide();
						}
						this.emp = val;
					});
				this.unsubscribe.push(sub);
			} else {
				console.log('no id');
			}
		});
		this.unsubscribe.push(sub);
	}

	ngOnInit(): void {}

	submitHours(index: number) {
		const controls = this.forms[index].controls;

		// check forms[index]
		if (this.forms[index].invalid) {
			Object.keys(controls).forEach((controlName) => controls[controlName].markAsTouched());
			return;
		}
		this.loading.show();

		this.db
			.updateEmpWorkHour(this.uid, index + 1, {
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
			.toggleEmpWorkHour(this.uid, index, e.checked)
			.then(() => {
				this.loading.hide();
				// this.flash.open()
			})
			.catch((e) => {
				this.loading.hide();
				this.flash.open(e.message, 'danger');
			});
	}

	ngOnDestroy(): void {
		this.unsubscribe.forEach((e) => {
			if (!e.closed) {
				e.unsubscribe();
			}
		});
	}
}
