import { IGNUser } from '../models/user.model';
import { Company } from '../models/company.model';
import { AppInfo } from '../models/index';
import { Employee } from '../models/employee.model';
import { Client } from '../models/client.model';
import { LicenceCode } from '../models/LicenceCode.model';
import { ServiceItem } from '../models/serviceItem.model';
import { ClientLicenceRecord } from '../models/clientLicenceRecord.model';
import { IGNTransaction } from '../models/transaction.model';
import { Appointment } from '../models/appointment.model';

export class SetUser {
	static readonly type = '[User] set user';
	constructor(public payload: IGNUser) {}
}

export class SetCompany {
	static readonly type = '[Company] set';
	constructor(public payload: Company) {}
}

export class Initiate {
	static readonly type = 'initiate data';
	constructor(public payload: IGNUser) {}
}

export class SetAppInfo {
	static readonly type = 'set AppInfo';
	constructor(public payload: AppInfo) {}
}

export class SetLicenceRecord {
	static readonly type = 'set licence record';
	constructor(public payload: ClientLicenceRecord) {}
}

export class SetClients {
	static readonly type = 'set clients []';
	constructor(public payload: Client[]) {}
}
export class SetEmployees {
	static readonly type = 'set Employees';
	constructor(public payload: Employee[]) {}
}

export class SetLicenceCodes {
	static readonly type = 'set licence Codes';
	constructor(public payload: LicenceCode[]) {}
}

export class SetTransactions {
	static readonly type = 'set transactions';
	constructor(public payload: IGNTransaction[]) {}
}

export class SetAppointments {
	static readonly type = 'set appointments';
	constructor(public payload: Appointment[]) {}
}

export class SetmyTransactions {
	static readonly type = 'set my transactions';
	constructor(public payload: IGNTransaction[]) {}
}

export class SetPackages {
	static readonly type = 'set packages';
	constructor(public payload: ServiceItem[]) {}
}
