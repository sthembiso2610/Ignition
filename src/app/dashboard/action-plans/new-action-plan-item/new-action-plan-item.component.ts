import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FlashService } from 'src/app/services/flash.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DbService } from 'src/app/services/db.service';
import { Select, Store } from '@ngxs/store';
import { AppState } from 'src/app/state/app.state';
import { Observable, Subscription } from 'rxjs';
import { Company } from 'src/app/models/company.model';
import { AppInfo } from 'src/app/models';
import { map, tap, take } from 'rxjs/operators';
import { ActionPlanItem } from 'src/app/models/LicenceCode.model';

@Component({
	selector: 'app-new-action-plan-item',
	templateUrl: './new-action-plan-item.component.html',
	styleUrls: [ './new-action-plan-item.component.scss' ]
})
export class NewActionPlanItemComponent implements OnInit, OnDestroy {
	form: FormGroup;
	id: string;
	task: ActionPlanItem;
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
			desc: [ '', [ Validators.required ] ]
		});

		this.route.paramMap.subscribe((params) => {
			if (params.get('id')) {
				this.id = params.get('id');
				const sub = this.store
					.select(AppState.planitem)
					.pipe(map((filterFn) => filterFn(this.id)))
					.subscribe((val) => {
						if (val.name != '' && !this.init) {
							this.init = true;
							this.task = val;
							this.form.controls['name'].setValue(val.name);
							this.form.controls['desc'].setValue(val.desc);
						}
					});
				this.unsubscribe.push(sub);
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
			const company: Company = this.store.snapshot().app.company;
			let tasks: ActionPlanItem[] = [ ...company.actionPlanItems ];
			console.log('tasks', tasks);
			tasks = tasks.sort((a, b) => {
				const val = Number(a.id) - Number(b.id);
				console.log('val', val);
				return val;
			});

			const type: ActionPlanItem = {
				name: this.form.controls['name'].value,
				id: tasks.length > 0 ? Number(Number(tasks[tasks.length - 1].id) + 1).toString() : '0',
				desc: this.form.controls['desc'].value
			};
			this.loading.show();
			let p: Promise<any>;
			if (this.isEditing) {
				type.id = this.task.id;
				p = this.db.updateActionPlanItem(type);
			} else {
				p = this.db.createActionPlanItem(type);
			}
			p
				.then(() => {
					this.loading.hide();
					this.router.navigate([ '/dashboard/lesson-tasks/all' ]);
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
