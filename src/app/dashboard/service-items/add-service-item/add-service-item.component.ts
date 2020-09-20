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
import { ServiceItem } from 'src/app/models/serviceItem.model';

@Component({
	selector: 'app-add-service-item',
	templateUrl: './add-service-item.component.html',
	styleUrls: [ './add-service-item.component.scss' ]
})
export class AddServiceItemComponent implements OnInit, OnDestroy {
	form: FormGroup;
	id: string;
	item: ServiceItem;
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
			cost: [ '', [ Validators.required, Validators.pattern('^[0-9]+([,.][0-9]+)?$') ] ],
			bookable: [ false, [ Validators.required ] ]
		});

		this.route.paramMap.subscribe((params) => {
			if (params.get('id')) {
				this.id = params.get('id');
				const sub = this.store
					.select(AppState.serviceitem)
					.pipe(map((filterFn) => filterFn(this.id)))
					.subscribe((val) => {
						if (val.name != '' && !this.init) {
							this.init = true;
							this.item = val;
							this.form.controls['name'].setValue(val.name);
							this.form.controls['bookable'].setValue(val.bookable);
							this.form.controls['cost'].setValue(val.cost.toString());
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
			const company: Company = this.store.snapshot().app.company;
			let items: ServiceItem[] = [ ...company.serviceItems ];
			items = items.sort((a, b) => Number(a.id) - Number(b.id));

			const item: ServiceItem = {
				name: this.form.controls['name'].value,
				id: items.length > 0 ? Number(Number(items[items.length - 1].id) + 1).toString() : '0',
				cost: Number(this.form.controls['cost'].value),
				bookable: this.form.controls['bookable'].value
			};
			console.log('item', item);
			this.loading.show();
			let p: Promise<any>;
			if (this.isEditing) {
				item.id = this.item.id;
				p = this.db.updateServiceItem(item);
			} else {
				p = this.db.createServiceItem(item);
			}
			p
				.then(() => {
					this.loading.hide();
					this.router.navigate([ '/dashboard/service-items/all' ]);
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
