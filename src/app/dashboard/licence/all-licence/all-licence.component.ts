import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select } from '@ngxs/store';
import { AppState } from 'src/app/state/app.state';
import { Observable, Subscription } from 'rxjs';
import { Company } from 'src/app/models/company.model';
import { AppInfo } from 'src/app/models';
import { LicenceCode, ActionPlanItem } from 'src/app/models/LicenceCode.model';
import { DialogService } from 'src/app/services/dialog.service';
import { Router } from '@angular/router';
import { FlashService } from 'src/app/services/flash.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DbService } from 'src/app/services/db.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
	selector: 'app-all-licence',
	templateUrl: './all-licence.component.html',
	styleUrls: [ './all-licence.component.scss' ],
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({ height: '0px', minHeight: '0' })),
			state('expanded', style({ height: '*' })),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
		])
	]
})
export class AllLicenceComponent implements OnInit, OnDestroy {
	@Select(AppState.company) company$: Observable<Company>;
	@Select(AppState.appInfo) appInfo$: Observable<AppInfo>;
	@Select(AppState.licenceCodes) licenceCodes$: Observable<LicenceCode[]>;

	columns: string[] = [ 'name', 'desc', 'actions' ];
	expandedElement: LicenceCode | null;
	localCompany: Company = {
		actionPlanItems: []
	};
	unsubscribe: Subscription[] = [];
	init: boolean = false;

	constructor(
		private dialog: DialogService,
		private router: Router,
		private flash: FlashService,
		private loading: NgxSpinnerService,
		private db: DbService
	) {
		const sub = this.company$.subscribe((data) => {
			if (data.name != '' && !this.init) {
				this.localCompany = data;
				this.init = true;
			}
		});
	}

	ngOnInit(): void {}

	getItems(ids: string[]): ActionPlanItem[] {
		return this.localCompany.actionPlanItems.filter((e) => ids.some((el) => el == e.id));
	}

	delete(element: LicenceCode) {
		// ! first check if any emps attached to this type

		this.dialog.confirm('Once deleted, you will not be able to recover this record').then((val) => {
			if (val) {
				this.loading.show();
				this.db
					.deleteLicenceCode(element)
					.then(() => {
						this.loading.hide();
					})
					.catch((e) => {
						this.loading.hide();
						this.flash.open(e.message, 'danger');
					});
			} else {
				console.log('dont delete');
			}
		});
	}

	edit(element: LicenceCode) {
		this.router.navigate([ `/dashboard/licence/${element.id}/edit` ]);
	}

	ngOnDestroy(): void {
		this.unsubscribe.forEach((e) => {
			if (!e.closed) {
				e.unsubscribe();
			}
		});
	}
}
