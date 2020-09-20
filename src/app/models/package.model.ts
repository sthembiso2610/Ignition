import { PackagePrice } from './packagePrice.model';
import { ServiceItem } from './serviceItem.model';

export interface IGNPackage {
	id?: string;
	name?: string;
	desc?: string;
	dateCreated?: Date;
	validUntil?: Date;
	active?: boolean;
	items?: ServiceItem[];
	price?: number;
}
