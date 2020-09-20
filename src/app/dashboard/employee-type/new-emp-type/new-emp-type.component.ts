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

@Component({
	selector: 'app-new-emp-type',
	templateUrl: './new-emp-type.component.html',
	styleUrls: [ './new-emp-type.component.scss' ]
})
export class NewEmpTypeComponent implements OnInit, OnDestroy {
	form: FormGroup;
	id: string;
	empType: EmployeeType;
	unsubscribe: Subscription[] = [];
	init: boolean = false;

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
			role: [ '', [ Validators.required ] ],
			desc: [ '', [ Validators.required ] ]
		});

		const sub = this.route.paramMap.subscribe((params) => {
			if (params.get('id')) {
				this.id = params.get('id');
				const sub = this.store
					.select(AppState.empType)
					.pipe(map((filterFn) => filterFn(this.id)))
					.subscribe((val) => {
						if (val.name != '' && !this.init) {
							this.init = true;
							this.empType = val;
							this.form.controls['name'].setValue(val.name);
							this.form.controls['desc'].setValue(val.desc);
							this.form.controls['role'].setValue(val.role.toString());
						}
					});
				this.unsubscribe.push(sub);
			} else {
				console.log('no id');
			}
		});
		this.unsubscribe.push(sub);
	}

	get isEditing() {
		return this.id != null && this.id != '' && this.id != undefined;
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
			const company: Company = this.store.snapshot().app.company;
			let types: EmployeeType[] = [ ...company.empTypes ];
			types = types.sort((a, b) => Number(a.id) - Number(b.id));

			const type: EmployeeType = {
				name: this.form.controls['name'].value,
				id: Number(Number(types[types.length - 1].id) + 1).toString(),
				role: Number(this.form.controls['role'].value),
				desc: this.form.controls['desc'].value
			};
			this.loading.show();
			let p: Promise<any>;
			if (this.isEditing) {
				type.id = this.empType.id;
				p = this.db.updateEmpType(type);
			} else {
				p = this.db.createEmpType(type);
			}
			p
				.then(() => {
					this.loading.hide();
					this.router.navigate([ '/dashboard/employee-type/all' ]);
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
