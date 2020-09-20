import { WorkDay } from '.';
import { EmployeeType } from './employeeType.model';
import { LicenceCode, ActionPlanItem } from './LicenceCode.model';
import { PaymentMethod } from './paymentType.model';
import { ServiceItem } from 'src/app/models/serviceItem.model';
import { Vehicle } from './vehicle.model';

export interface Company {
	id?: string;
	uid?: string;
	name?: string;
	email?: string;
	phone?: string;
	code?: string;
	setup?: boolean;
	adminId?: number;
	rate?: number;
	vehicles?: Vehicle[];
	expiryPeriod?: number;
	deposit?: number;
	workingHours?: WorkDay[];
	serviceItems?: ServiceItem[];
	actionPlanItems?: ActionPlanItem[];
	paymentTypes?: PaymentMethod[];
	empTypes?: EmployeeType[];
}
