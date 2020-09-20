export interface ClientLicenceRecord {
	id?: string;
	clientID?: number;
	licenceCode?: string;
	testDate?: Date;
	active?: boolean;
	passed?: boolean;
}
