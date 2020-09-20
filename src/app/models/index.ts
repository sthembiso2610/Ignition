import { LicenceCode, ActionPlanItem } from './LicenceCode.model';
import { GenderOption } from './genderOption.model';
import { SpecialNeed } from './specialNeed.model';
import { EmployeeType } from './employeeType.model';
import { Role } from './role.model';
import { PaymentMethod } from './paymentType.model';
import { ContactRelation } from 'src/app/models/emergerncyContactRelation.model';
import { AppointmentType } from 'src/app/models/appointmenttype.model';

export interface AppInfo {
	codes?: LicenceCode[];
	genderOptions?: GenderOption[];
	specialNeeds?: SpecialNeed[];
	workingHours?: WorkDay[];
	empTypes?: EmployeeType[];
	avatar?: string;
	roles?: Role[];
	lessonTasks?: ActionPlanItem[];
	paymentTypes?: PaymentMethod[];
	appointmentTypes?: AppointmentType[];
	relations?: ContactRelation[];
}

export interface ClientInvite {
	id?: string;
	name?: string;
	email?: string;
	company?: string;
	code?: string;
	dateCreated?: Date;
}

export interface IGNAddress {
	geometry?: Geometry;
	name?: string;
	id?: string;
	vicinity?: string;
	url?: string;
	formatted?: string;
}

export interface Geometry {
	lat?: number;
	lng?: number;
}

export interface Hour {
	name?: string;
	value?: number;
}

export interface WorkDayHour {
	open?: number;
	close?: number;
}

export interface WorkDay {
	name?: string;
	day?: number;
	value?: boolean;
	hours?: WorkDayHour;
}
