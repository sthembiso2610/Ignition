export interface Appointment {
	id?: string;
	serviceItem?: string;
	location?: string;
	status?: string;
	type?: string;
	serviceID?: string;
	clientID?: string;
	reviewID?: string;
	empAvatar?: string;
	empName?: string;
	StartTime?: Date;
	EndTime?: Date;
	Subject?: string;
	empUid?: string;
	startSlot?: number;
	endSlot?: number;
	clientUid?: string;
	clientName?: string;
	clientAvatar?: string;
}
