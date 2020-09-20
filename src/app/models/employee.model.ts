import { EmergencyContact } from './emergencyContact.model';
import { IGNAddress, WorkDay } from '.';

export interface Employee {
	uid?: string;
	companyID?: string;
	email?: string;
	setup?: boolean;
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
