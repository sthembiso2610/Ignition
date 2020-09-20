export interface ServiceItem {
	id?: string;
	name?: string;
	desc?: string;
	bookable?: boolean;
	cost?: number;
	quantity?: number; // only to be used when item is part of a package
}
