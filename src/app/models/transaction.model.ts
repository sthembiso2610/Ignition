export interface IGNTransaction {
	id?: string;
	uid?: string;
	type?: number; // 0 for negative, 1 for positive
	createdAt?: Date;
	paymentType?: string;
	amount?: number;
}
