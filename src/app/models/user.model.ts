import { WorkDay } from '.';
import { EmergencyContact } from 'src/app/models/emergencyContact.model';
import { IGNAddress } from '.';
import { IGNPackage } from './package.model';
export interface IGNUser {
	uid?: string;
	companyID?: string;
	email?: string;
	setup?: boolean;
	packages?: IGNPackage[];
	name?: string;
	isActive?: boolean;
	firstname?: string;
	lastname?: string;
	hasSpecialNeed?: boolean;
	specialNeed?: string;
	IDNum?: string;
	password?: string; // ! for temporary storage, emps
	phone?: string;
	contact?: EmergencyContact;
	gender?: number;
	address?: IGNAddress;
	workingHours?: WorkDay[];
	imageUrl?: string;
	userType?: number; // * 0 for client, 1 for employees and admin
	empType?: string; // -1 for clients, 0 for admin, 1 for normal emplyees, other customer emp types
}
