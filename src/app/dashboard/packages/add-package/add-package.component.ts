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
import { IGNPackage } from 'src/app/models/package.model';
import { ServiceItem } from 'src/app/models/serviceItem.model';

@Component({
	selector: 'app-add-package',
	templateUrl: './add-package.component.html',
	styleUrls: [ './add-package.component.scss' ]
})
export class AddPackageComponent implements OnInit, OnDestroy {
	form: FormGroup;
	id: string;
	package: IGNPackage;
	unsubscribe: Subscription[] = [];
	init: boolean = false;
	itemsInit: boolean = false;
	localServiceItems: ServiceItem[] = [];

	@Select(AppState.company) company$: Observable<Company>;
	@Select(AppState.appInfo) appInfo$: Observable<AppInfo>;
	@Select(AppState.serviceItems) serviceitems$: Observable<ServiceItem[]>;

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
			price: [ '', [ Validators.required, Validators.pattern('^[0-9]+([,.][0-9]+)?$') ] ],
			desc: [ '', [ Validators.required ] ],
			active: [ true, [ Validators.required ] ]
		});

		this.route.paramMap.subscribe((params) => {
			const sub1 = this.company$.subscribe((comp) => {
				console.log('got here');
				if (comp.name != '' && !this.itemsInit) {
					console.log('setting items', comp);
					this.localServiceItems = comp.serviceItems;
					this.itemsInit = true;
				}
			});
			this.unsubscribe.push(sub1);
			if (params.get('id')) {
				this.id = params.get('id');
				const sub = this.store
					.select(AppState.package)
					.pipe(map((filterFn) => filterFn(this.id)))
					.subscribe((val) => {
						if (val.name != '' && !this.init) {
							this.init = true;
							this.package = val;
							this.form.controls['active'].setValue(val.active);
							this.form.controls['name'].setValue(val.name);
							this.form.controls['desc'].setValue(val.desc);
							this.form.controls['price'].setValue(val.price.toString());
							val.items.forEach((e) => {
								let index: number = this.localServiceItems.findIndex((el) => el.id == e.id);
								if (index != -1) {
									this.localServiceItems[index].quantity = e.quantity;
								}
							});
						}
					});
				this.unsubscribe.push(sub);
			} else {
				console.log('no id');
			}
		});
	}

	get price(): number {
		let total = 0;
		this.localServiceItems.forEach((e) => (total += e.quantity * e.cost));
		return total;
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

	remove(val) {
		if (val != undefined) {
			const item: ServiceItem = val.value;
			const index = this.localServiceItems.indexOf(item);
			if (index != -1) {
				if (this.localServiceItems[index].quantity > 0) {
					this.localServiceItems[index].quantity--;
				}
			}
		}
	}

	add(val) {
		if (val != undefined) {
			const item: ServiceItem = val.value;
			const index = this.localServiceItems.indexOf(item);
			if (index != -1) {
				this.localServiceItems[index].quantity++;
			}
		}
	}

	submit() {
		if (this.validateForm()) {
			const items: ServiceItem[] = this.localServiceItems.filter((e) => e.quantity > 0);
			const quantity: number = items.reduce((prev, current, index) => prev + current.quantity, 0);
			if (quantity > 1) {
				const newEntry: IGNPackage = {
					name: this.form.controls['name'].value,
					desc: this.form.controls['desc'].value,
					items: items,
					active: this.form.controls['active'].value,
					price: Number(this.form.controls['price'].value)
				};
				this.loading.show();
				let p: Promise<any>;
				if (this.isEditing) {
					newEntry.id = this.id;
					p = this.db.updatePackage(newEntry);
				} else {
					p = this.db.createPackage(newEntry);
				}
				p
					.then(() => {
						this.loading.hide();
						this.router.navigate([ '/dashboard/packages/all' ]);
					})
					.catch((e) => {
						this.loading.hide();
						this.flash.open(e.message, 'danger');
					});
			} else {
				this.flash.open('A package must have atleast two items', 'info');
			}
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
