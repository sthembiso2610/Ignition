import { Component, OnInit, Inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { AppState, StateModel } from 'src/app/state/app.state';
import { Observable } from 'rxjs';
import { Company } from 'src/app/models/company.model';
import { AppInfo, Hour, WorkDay } from 'src/app/models';
import { IGNUser } from 'src/app/models/user.model';
import { DialogService } from 'src/app/services/dialog.service';
import { Router } from '@angular/router';
import { FlashService } from 'src/app/services/flash.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DbService } from 'src/app/services/db.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { data as d, data } from 'src/app/shared/data';
import { Employee } from 'src/app/models/employee.model';
import { Appointment } from 'src/app/models/appointment.model';
import { Client } from 'src/app/models/client.model';
import { IGNPackage } from 'src/app/models/package.model';
import { IGNTransaction } from 'src/app/models/transaction.model';

@Component({
	selector: 'app-event',
	templateUrl: './event.component.html',
	styleUrls: [ './event.component.scss' ]
})
export class EventComponent implements OnInit {
	hours: Hour[] = d.hours;
	description: string = 'New event';
	@Select(AppState.company) company$: Observable<Company>;
	@Select(AppState.appInfo) appInfo$: Observable<AppInfo>;
	@Select(AppState.user) user$: Observable<IGNUser>;
	@Select(AppState.instructors) instructors$: Observable<Employee[]>;
	@Select(AppState.clients) clients$: Observable<Client[]>;
	@Select(AppState.myPackages) myPackages$: Observable<IGNPackage[]>;
	localPackages: IGNPackage[] = [];
	userTransactions: IGNTransaction[] = [];

	form: FormGroup;

	constructor(
		private fb: FormBuilder,
		private store: Store,
		private dialogRef: MatDialogRef<EventComponent>,
		@Inject(MAT_DIALOG_DATA) private inputData: Appointment,
		private dialog: DialogService,
		private router: Router,
		private flash: FlashService,
		private loading: NgxSpinnerService,
		private db: DbService
	) {
		const info: AppInfo = this.store.snapshot().app.appInfo;
		const user: IGNUser = this.store.snapshot().app.user;
		this.myPackages$.subscribe((data) => {});
	}

	get eventHasPassed(): boolean {
		return this.inputData.StartTime < new Date(Date.now());
	}

	getAvailableInstructors(users: Employee[]) {
		let dayOfWeek: number = this.inputData.StartTime.getDay();
		let start: number = Number(this.form.controls['start'].value);
		let end: number = Number(this.form.controls['end'].value);
		users.filter((el) => {
			let day: WorkDay = el.workingHours[el.workingHours.findIndex((hour) => hour.day == day)];
			let isOpen: boolean = day.hours.open < start && day.hours.close > end;
			const appointments: Appointment[] = this.store.snapshot().app.appointments;
		});
	}

	canSave() {
		const info: AppInfo = this.store.snapshot().app.appInfo;
		const user: IGNUser = this.store.snapshot().app.user;
		if (this.eventHasPassed) {
			return false;
		}
		// check if you're an admin or client
		if (user.userType == 0) {
		} else {
		}
	}

	ngOnInit(): void {
		let startHour: number = this.inputData.StartTime.getHours();
		let endHour: number = this.inputData.EndTime.getHours();
		this.form = this.fb.group({
			clientUid: [ '', [ Validators.required ] ],
			type: [ '', [ Validators.required ] ],
			start: [ startHour, [ Validators.required ] ],
			end: [ endHour, [ Validators.required ] ],
			service: [ '', Validators.required ],
			instructor: [ '', [ Validators.required ] ]
		});
		const user: IGNUser = this.store.snapshot().app.user;
		console.log('user', user);
		if (user.userType == 0) {
			this.form.controls['clientUid'].setValue(user);
			this.form.controls['clientUid'].updateValueAndValidity();
			this.form.controls['clientUid'].disable();
		}
		if (this.isViewing) {
			this.form.controls['type'].setValue(this.inputData.type);
		}
	}

	get isViewing(): boolean {
		return this.inputData.id != undefined && this.inputData.id != null && this.inputData.id != '';
	}

	get hasPackage(): boolean {
		if (this.localPackages.length < 1) {
			return false;
		}
		let serviceId: string = this.form.controls['service'].value;
		this.localPackages.some((el) => {
			return el.items.some((e) => e.id == serviceId && e.quantity > 0);
		});
	}

	get package(): IGNPackage {
		if (this.hasPackage) {
			let serviceId: string = this.form.controls['service'].value;
			const index = this.localPackages.findIndex((el) => {
				return el.items.some((e) => e.id == serviceId && e.quantity > 0);
			});
			return this.localPackages[index];
		}
		return null;
	}

	servicePrice(id: string) {
		const company: Company = this.store.snapshot().app.company;
		const user: IGNUser = this.store.snapshot().app.user;
		let index: number = company.serviceItems.findIndex((e) => e.id == id);
		if (index == -1) {
			return 'R -- . --';
		} else {
			return `R ${company.serviceItems[index].cost.toFixed(2)}`;
		}
	}

	get serviceHint(): string {
		if (this.form.controls['service'] == undefined) {
			return '';
		}
		const val: string = this.form.controls['service'].value;
		if (val == '' || val == undefined) {
			return '';
		}
		return this.hasPackage
			? 'One unit will be deducted from your package'
			: `${this.servicePrice(val)} will be deducted from your wallet`;
	}

	get isDrivingLesson(): boolean {
		return this.form.controls['type'].value == '0';
	}

	typeChanged(e) {
		if (e.value == '0') {
			this.form.controls['service'].setValidators([ Validators.required ]);
			this.form.controls['instructor'].setValidators([ Validators.required ]);
		} else {
			this.form.controls['service'].clearValidators();
			this.form.controls['instructor'].clearValidators();
		}
		this.form.controls['service'].updateValueAndValidity();
		this.form.controls['instructor'].updateValueAndValidity();
	}

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
		if (this.form.controls['clientUid'].value.uid == undefined) {
			this.flash.open('Please select a client', 'danger');
			return false;
		}
		return true;
	}

	isEditing(): boolean {
		return this.inputData.id != undefined && this.inputData.id != null && this.inputData.id != '';
	}

	save() {
		this.dialogRef.close(this.form.value);
	}

	close() {
		this.dialogRef.close();
	}

	displayFn(user: IGNUser): string {
		return user && user.name ? user.name : '';
	}

	submit() {
		if (this.validateForm()) {
			const state: StateModel = this.store.snapshot().app;
			let client: Client = this.form.controls['clientUid'].value;
			const type: string = this.form.controls['type'].value;
			let instructor: Employee;

			let appoint: Appointment = {
				startSlot: Number(this.form.controls['start'].value),
				endSlot: Number(this.form.controls['end'].value),
				StartTime: new Date(
					this.inputData.StartTime.getFullYear(),
					this.inputData.StartTime.getMonth(),
					this.inputData.StartTime.getDate(),
					Number(this.form.controls['start'].value)
				),
				EndTime: new Date(
					this.inputData.EndTime.getFullYear(),
					this.inputData.EndTime.getMonth(),
					this.inputData.EndTime.getDate(),
					Number(this.form.controls['end'].value)
				),
				type,
				clientUid: client.uid,
				clientName: client.name,
				clientAvatar: client.imageUrl
			};

			if (type == '0') {
				let instructorUid: string = this.form.controls['instructor'].value;
				let instructorIndex: number = state.employees.findIndex((e) => e.uid == instructorUid);
				instructor =
					instructorIndex == -1 ? { name: 'N/found', uid: instructorUid } : state.employees[instructorIndex];
				appoint.empUid = instructorUid;
				appoint.empAvatar = instructor.imageUrl;
				appoint.empName = instructor.name;
				appoint.Subject = instructor.name;
				appoint.serviceItem = this.form.controls['service'].value.id;
			} else {
				appoint.Subject = `Learner's - ${client.name}`;
			}

			const info: AppInfo = this.store.snapshot().app.appInfo;
			const transactions: IGNTransaction[] = this.store.snapshot().app.transactions;
			const balance: number = transactions.filter((t) => t.uid == client.uid).reduce((prev, current, index) => {
				if (current.type == 1) {
					return prev + current.amount;
				} else {
					return prev - current.amount;
				}
			}, 0);

			if (this.hasPackage || balance >= this.form.controls['service'].value.cost) {
				this.loading.show();
				this.db
					.createAppointment(appoint)
					.then(() => {
						this.loading.hide();
						if (this.hasPackage) {
							this.db
								.subtractItemFromPackage(client.uid, this.package, appoint.serviceItem)
								.catch((e) => {
									console.log('caught here');
									this.loading.hide();
									this.flash.open(e.message, 'danger');
								});
						} else {
							const trans: IGNTransaction = {
								amount: this.form.controls['service'].value.cost,
								type: 0,
								paymentType: '0',
								uid: client.uid,
								createdAt: new Date(Date.now())
							};

							this.db.createTransaction(trans);
						}
						this.close();
					})
					.catch((e) => {
						this.loading.hide();
						this.flash.open(e.message, 'danger');
					});
			} else {
				this.loading.hide();
				this.flash.open(
					'Insufficient funds to make appointment, please topup or buy one of our packages',
					'danger'
				);
			}
		} else {
			console.log('invalid');
		}
	}
}
