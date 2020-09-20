import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {
	DayService,
	WeekService,
	WorkWeekService,
	MonthService,
	AgendaService,
	MonthAgendaService,
	TimelineViewsService,
	TimelineMonthService,
	PopupOpenEventArgs,
	EventSettingsModel,
	TimeScaleModel,
	ScheduleComponent
} from '@syncfusion/ej2-angular-schedule';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { DateTimePicker } from '@syncfusion/ej2-calendars';
import { Appointment } from 'src/app/models/appointment.model';
import { Employee } from 'src/app/models/employee.model';
import { Select, Store } from '@ngxs/store';
import { AppState } from 'src/app/state/app.state';
import { Observable, Subscription } from 'rxjs';
import { Company } from 'src/app/models/company.model';
import { AppInfo } from 'src/app/models';
import { IGNUser } from 'src/app/models/user.model';
import { DialogService } from 'src/app/services/dialog.service';
import { Router } from '@angular/router';
import { FlashService } from 'src/app/services/flash.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DbService } from 'src/app/services/db.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EventComponent } from '../entry/event/event.component';
import { EmployeeType } from 'src/app/models/employeeType.model';

@Component({
	selector: 'app-calendar',
	templateUrl: './calendar.component.html',
	styleUrls: [ './calendar.component.scss' ],
	providers: [
		DayService,
		WeekService,
		WorkWeekService,
		MonthService,
		AgendaService,
		MonthAgendaService,
		TimelineViewsService,
		TimelineMonthService
	]
})
export class CalendarComponent implements OnInit, OnDestroy {
	@Select(AppState.company) company$: Observable<Company>;
	@Select(AppState.appInfo) appInfo$: Observable<AppInfo>;
	@Select(AppState.user) user$: Observable<IGNUser>;
	@Select(AppState.employees) employees$: Observable<Employee[]>;
	@Select(AppState.appointments) appointments$: Observable<Appointment[]>;
	@Select(AppState.empAppointments) empAppointments: Observable<Appointment[]>;
	@Select(AppState.myAppointments) myAppointments$: Observable<Appointment[]>;
	public selectedDate: Date = new Date(Date.now());
	public views: Array<string> = [ 'Day', 'Week', 'WorkWeek', 'Month' ];
	public showQuickInfo: Boolean = false;
	public userInit: boolean = false;
	public localAppointments: Appointment[] = [];
	public timeScaleOptions: TimeScaleModel = { enable: true, slotCount: 1 };
	public localInstructors: Employee[] = [];
	public eventSettings: EventSettingsModel = {
		dataSource: this.localAppointments
	};
	unsubscribe: Subscription[] = [];
	localInfo: AppInfo = {};

	@ViewChild('schedule') public schedule: ScheduleComponent;

	get appointmentTypes() {
		return this.localInfo.appointmentTypes || [];
	}

	constructor(
		private dialog: DialogService,
		private router: Router,
		private matDialog: MatDialog,
		private flash: FlashService,
		private loading: NgxSpinnerService,
		private db: DbService,
		private store: Store
	) {
		const sub = this.appointments$.subscribe((data) => {
			this.localAppointments = data;
			this.eventSettings = {
				dataSource: data
			};
		});
	}

	ngOnInit(): void {}

	onPopupOpen(args: PopupOpenEventArgs): void {
		args.cancel = true;
		if (args.type === 'Editor' || args.type === 'QuickInfo') {
			console.log('data', args.data);
			if ((<Appointment>args.data).id != undefined) {
				this.openDialog(args.data);
			} else {
				if ((<Appointment>args.data).StartTime > new Date(Date.now())) {
					this.openDialog(args.data);
				} else {
					this.flash.open('Appointments cannot be created for past dates', 'info');
				}
			}
		}
	}

	getType(id: string, company: Company): EmployeeType | null {
		const index = company.empTypes.findIndex((e) => e.id == id);
		return index == -1 ? null : company.empTypes[index];
	}

	openDialog(data) {
		const info: AppInfo = this.store.snapshot().app.appInfo;
		const user: IGNUser = this.store.snapshot().app.user;
		const company: Company = this.store.snapshot().app.company;
		if (user.userType == 0 || this.getType(user.empType, company).role == 2) {
			const dialogConfig = new MatDialogConfig();

			dialogConfig.disableClose = true;
			dialogConfig.autoFocus = true;
			dialogConfig.data = data;
			this.matDialog.open(EventComponent, dialogConfig);
		} else {
			this.flash.open('only clients and admin users can create appointments', 'danger');
		}
	}

	ngOnDestroy(): void {
		this.unsubscribe.forEach((e) => {
			if (!e.closed) {
				e.unsubscribe();
			}
		});
	}
}
