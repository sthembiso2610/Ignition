import { Injectable } from '@angular/core';
import {
	AngularFirestore,
	DocumentReference,
	DocumentSnapshot,
	DocumentData,
	DocumentSnapshotExists,
	QuerySnapshot
} from '@angular/fire/firestore';
import { Company } from '../models/company.model';
import { Store } from '@ngxs/store';
import { WorkDay, WorkDayHour, AppInfo, ClientInvite } from '../models';
import { firestore } from 'firebase';
import { IGNUser } from '../models/user.model';
import { Employee } from '../models/employee.model';
import { Observable } from 'rxjs';
import { EmployeeType } from '../models/employeeType.model';
import { LicenceCode, ActionPlanItem } from '../models/LicenceCode.model';
import { IGNTransaction } from 'src/app/models/transaction.model';
import { ServiceItem } from '../models/serviceItem.model';
import { IGNPackage } from '../models/package.model';
import { ClientLicenceRecord } from '../models/clientLicenceRecord.model';
import { Appointment } from '../models/appointment.model';
import { Vehicle } from '../models/vehicle.model';

@Injectable({
	providedIn: 'root'
})
export class DbService {
	constructor(private afStore: AngularFirestore, private store: Store) {}

	async emailExists(email: string): Promise<boolean> {
		const snap: QuerySnapshot<DocumentData> = await firestore()
			.collection('users')
			.where('email', '==', email)
			.get();
		return snap.docs.length > 0;
	}

	async phoneExists(phone: string): Promise<boolean> {
		const snap: QuerySnapshot<DocumentData> = await firestore()
			.collection('users')
			.where('phone', '==', phone)
			.get();
		return snap.docs.length > 0;
	}

	async userIsActive(uid: string): Promise<boolean> {
		const snap = await firestore().doc(`users/${uid}`).get();
		if (!snap.exists) {
			return false;
    }
    console.log(snap.data())
    //changed  snap.data().isActive; to snap.Exists
		return snap.exists;
	}

	purchasePackage(uid: string, item: IGNPackage, trans: IGNTransaction): Promise<void> {
		const company: Company = this.store.snapshot().app.company;
		const batch: firestore.WriteBatch = firestore().batch();
		const transRef: DocumentReference = firestore().collection(`companies/${company.id}/transactions`).doc();
		const userRef: DocumentReference = firestore().doc(`users/${uid}`);
		batch.set(transRef, trans);
		batch.set(userRef, {
			packages: firestore.FieldValue.arrayUnion(item)
		});
		return batch.commit();
	}

	subtractItemFromPackage(uid: string, item: IGNPackage, serviceItemId: string): Promise<void> {
		const company: Company = this.store.snapshot().app.company;
		return firestore().runTransaction(async (transaction) => {
			const ref: DocumentReference = firestore().doc(`users/${uid}`);
			const snap = await transaction.get(ref);
			let packages: IGNPackage[] = snap.data().packages;
			let index = packages.findIndex((e) => e.id == item.id);
			if (index != 1) {
				let serviceItems: ServiceItem[] = packages[index].items;
				let itemIndex = serviceItems.findIndex((el) => el.id == serviceItemId);
				if (itemIndex != -1) {
					if (serviceItems[itemIndex].quantity > 0) {
						serviceItems[itemIndex].quantity--;
					}
				}
				packages[index].items = serviceItems;
			}

			transaction.update(ref, {
				packages: packages
			});
		});
	}

	async idNumExists(idNum: string): Promise<boolean> {
		const snap: QuerySnapshot<DocumentData> = await firestore()
			.collection('users')
			.where('idNum', '==', idNum)
			.get();
		return snap.docs.length > 0;
	}

	company$(id: string): Observable<DocumentData> {
		return this.afStore.doc(`companies/${id}`).snapshotChanges();
	}

	createEmp(user: IGNUser): Promise<void> {
		return firestore().doc(`users/${user.uid}`).set(user);
	}

	createUser(data: { user: IGNUser; company: Company }): Promise<void> {
		const info: AppInfo = this.store.snapshot().app.appInfo;

		const batch: firestore.WriteBatch = firestore().batch();
		// todo: 1. create user
		batch.set(firestore().doc(`users/${data.user.uid}`), data.user);
		// todo: 2.create company
		data.company.code = `${data.user.uid.substr(0, 6)}${Date.now()
			.toString()
			.substr(Date.now().toString().length - 3, 2)}`;
		batch.set(firestore().doc(`companies/${data.user.uid}`), data.company);
		// todo: licence codes
		info.codes.forEach((element) => {
			const ref: DocumentReference = firestore()
				.doc(`companies/${data.user.uid}`)
				.collection('licencecodes')
				.doc();
			batch.set(ref, element);
		});

		return batch.commit();
	}

	createClientUser(user: IGNUser): Promise<void> {
		const batch: firestore.WriteBatch = firestore().batch();
		batch.set(firestore().doc(`users/${user.uid}`), user);
		batch.set(firestore().doc(`users/${user.uid}`).collection('records').doc(), {
			passed: false,
			active: true,
			id: '0'
		});

		return batch.commit();
	}

	clientSetup(data: { user: IGNUser; licenceCode: string }): Promise<void> {
		const record: ClientLicenceRecord = this.store.snapshot().app.licencerecord;
		const batch: firestore.WriteBatch = firestore().batch();
		batch.set(firestore().doc(`users/${data.user.uid}`), data.user);
		batch.set(firestore().doc(`users/${data.user.uid}/records/${record.id}`), {
			licenceCode: data.licenceCode
		});
		return batch.commit();
	}

	getCompanyFromCode(code: string): Promise<Company | null> {
		return new Promise(async (resolve, reject) => {
			let snap: QuerySnapshot<DocumentData>;
			try {
				snap = await firestore().collection('companies').where('code', '==', code).get();
			} catch (error) {
				reject(error);
			}
			let comp: Company;
			if (snap.docs.length > 0) {
				comp = { ...snap.docs[0].data(), id: snap.docs[0].id };
			} else {
				comp = null;
			}
			resolve(comp);
		});
	}

	createClient() {}

	getUser(uid: string): Promise<any> {
		return this.afStore.doc(`users/${uid}`).get().toPromise();
	}

	createCompany(company: Company): Promise<DocumentReference> {
		return this.afStore.collection('companies').add(company);
	}

	toggleWorkHour(idx: number, newValue: boolean) {
		const company: Company = this.store.snapshot().app.company;
		return firestore().runTransaction(async (transaction) => {
			const ref: firebase.firestore.DocumentReference = firestore().doc(`companies/${company.id}`);
			const snap = await transaction.get(ref);
			const data = snap.data();
			console.log('company data', snap.data());
			let hours: WorkDay[] = data.workingHours;
			const index = hours.findIndex((e) => e.day === idx);
			hours[index].value = newValue;
			transaction.update(ref, {
				workingHours: hours
			});
		});
	}

	toggleEmpWorkHour(uid: string, idx: number, newValue: boolean) {
		const company: Company = this.store.snapshot().app.company;
		return firestore().runTransaction(async (transaction) => {
			const ref: firebase.firestore.DocumentReference = firestore().doc(`users/${uid}`);
			const snap = await transaction.get(ref);
			const data = snap.data();
			let hours: WorkDay[] = data.workingHours;
			const index = hours.findIndex((e) => e.day === idx);
			hours[index].value = newValue;
			transaction.update(ref, {
				workingHours: hours
			});
		});
	}

	updateCompany(update: Object): Promise<void> {
		const company: Company = this.store.snapshot().app.company;
		return firestore().doc(`companies/${company.id}`).update(update);
	}

	updateWorkHour(idx: number, newHours: WorkDayHour) {
		const company: Company = this.store.snapshot().app.company;
		return firestore().runTransaction(async (transaction) => {
			const ref: firebase.firestore.DocumentReference = firestore().doc(`companies/${company.id}`);
			const snap = await transaction.get(ref);
			const data = snap.data();
			let hours: WorkDay[] = data.workingHours;
			const index = hours.findIndex((e) => e.day === idx);
			console.log('hours', index);
			hours[index].hours = newHours;
			transaction.update(ref, {
				workingHours: hours
			});
		});
	}

	updateEmpWorkHour(uid: string, idx: number, newHours: WorkDayHour) {
		const company: Company = this.store.snapshot().app.company;
		return firestore().runTransaction(async (transaction) => {
			const ref: firebase.firestore.DocumentReference = firestore().doc(`users/${uid}`);
			const snap = await transaction.get(ref);
			const data = snap.data();
			let hours: WorkDay[] = data.workingHours;
			const index = hours.findIndex((e) => e.day === idx);
			console.log('hours', index);
			hours[index].hours = newHours;
			transaction.update(ref, {
				workingHours: hours
			});
		});
	}

	sendInvite(invite: ClientInvite): Promise<DocumentReference> {
		const company: Company = this.store.snapshot().app.company;
		invite.company = company.name;
		invite.code = company.code;
		return firestore().collection(`companies/${company.id}/invites`).add(invite);
	}

	updateProfile(data: any) {
		const user: IGNUser = this.store.snapshot().app.user;
		return firestore().doc(`users/${user.uid}`).set({ ...data, setup: true }, { merge: true });
	}

	updateUser(uid: string, data: any) {
		return firestore().doc(`users/${uid}`).set({ ...data }, { merge: true });
	}

	createVehicle(newRec: Vehicle): Promise<void> {
		const company: Company = this.store.snapshot().app.company;
		return firestore().doc(`companies/${company.id}`).update({
			vehicles: firestore.FieldValue.arrayUnion(newRec)
		});
	}

	async updateVehicle(Vehicle: EmployeeType) {
		const company: Company = this.store.snapshot().app.company;
		const ref: DocumentReference = firestore().doc(`companies/${company.id}`);
		return firestore().runTransaction(async (transaction) => {
			const snap = await ref.get();
			const vehicles = snap.data().vehicles;
			const index = vehicles.findIndex((element) => element.id === Vehicle.id);
			if (index != -1) {
				vehicles[index] = Vehicle;
			}
			await ref.update({
				vehicles: vehicles
			});
		});
	}

	deleteVehicle(newRec: EmployeeType): Promise<void> {
		const company: Company = this.store.snapshot().app.company;
		return firestore().doc(`companies/${company.id}`).update({
			vehicles: firestore.FieldValue.arrayRemove(newRec)
		});
	}

	createEmpType(newRec: EmployeeType): Promise<void> {
		const company: Company = this.store.snapshot().app.company;
		return firestore().doc(`companies/${company.id}`).update({
			empTypes: firestore.FieldValue.arrayUnion(newRec)
		});
	}

	async updateEmpType(empType: EmployeeType) {
		const company: Company = this.store.snapshot().app.company;
		const ref: DocumentReference = firestore().doc(`companies/${company.id}`);
		return firestore().runTransaction(async (transaction) => {
			const snap = await ref.get();
			const empTypes = snap.data().empTypes;
			const index = empTypes.findIndex((element) => element.id === empType.id);
			if (index != -1) {
				empTypes[index] = empType;
			}
			await ref.update({
				empTypes: empTypes
			});
		});
	}

	deleteEmpType(newRec: EmployeeType): Promise<void> {
		const company: Company = this.store.snapshot().app.company;
		return firestore().doc(`companies/${company.id}`).update({
			empTypes: firestore.FieldValue.arrayRemove(newRec)
		});
	}

	createLicenceCode(code: LicenceCode) {
		const company: Company = this.store.snapshot().app.company;
		return firestore().collection(`companies/${company.id}/licencecodes`).add(code);
	}

	updateLicenceCode(code: LicenceCode): Promise<void> {
		const company: Company = this.store.snapshot().app.company;
		return firestore().doc(`companies/${company.id}/licencecodes/${code.id}`).update(code);
	}

	deleteLicenceCode(code: LicenceCode) {
		const company: Company = this.store.snapshot().app.company;
		return firestore().doc(`companies/${company.id}/licencecodes/${code.id}`).delete();
	}

	createPackage(item: IGNPackage) {
		const company: Company = this.store.snapshot().app.company;
		return firestore().collection(`companies/${company.id}/packages`).add(item);
	}

	updatePackage(item: IGNPackage): Promise<void> {
		const company: Company = this.store.snapshot().app.company;
		return firestore().doc(`companies/${company.id}/packages/${item.id}`).update(item);
	}

	deletePackage(item: IGNPackage) {
		const company: Company = this.store.snapshot().app.company;
		return firestore().doc(`companies/${company.id}/packages/${item.id}`).delete();
	}

	createTransaction(transaction: IGNTransaction) {
		const company: Company = this.store.snapshot().app.company;
		return firestore().collection(`companies/${company.id}/transactions`).add(transaction);
	}

	deleteTransaction(transaction: IGNTransaction) {
		const company: Company = this.store.snapshot().app.company;
		return firestore().doc(`companies/${company.id}/transactions/${transaction.id}`).delete();
	}

	createAppointment(appointment: Appointment) {
		const company: Company = this.store.snapshot().app.company;
		return firestore().collection(`companies/${company.id}/appointments`).add(appointment);
	}

	updateAppointment(appointment: Appointment) {
		const company: Company = this.store.snapshot().app.company;
		return firestore().doc(`companies/${company.id}/appointments/${appointment.id}`).update(appointment);
	}

	cancelAppointment(appointment: Appointment) {
		const company: Company = this.store.snapshot().app.company;
		return firestore().doc(`companies/${company.id}/appointments/${appointment.id}`).delete();
	}

	createServiceItem(newRec: ServiceItem): Promise<void> {
		const company: Company = this.store.snapshot().app.company;
		return firestore().doc(`companies/${company.id}`).update({
			serviceItems: firestore.FieldValue.arrayUnion(newRec)
		});
	}

	async updateServiceItem(empType: ServiceItem) {
		const company: Company = this.store.snapshot().app.company;
		const ref: DocumentReference = firestore().doc(`companies/${company.id}`);
		return firestore().runTransaction(async (transaction) => {
			const snap = await ref.get();
			const serviceItems = snap.data().serviceItems;
			const index = serviceItems.findIndex((element) => element.id === empType.id);
			if (index != -1) {
				serviceItems[index] = empType;
			}
			await ref.update({
				serviceItems: serviceItems
			});
		});
	}

	deleteServiceItem(newRec: ServiceItem): Promise<void> {
		const company: Company = this.store.snapshot().app.company;
		return firestore().doc(`companies/${company.id}`).update({
			serviceItems: firestore.FieldValue.arrayRemove(newRec)
		});
	}

	deleteServiceItemMultiple(newRec: ServiceItem[]): Promise<void> {
		const company: Company = this.store.snapshot().app.company;
		return firestore().doc(`companies/${company.id}`).update({
			serviceItems: firestore.FieldValue.arrayRemove(...newRec)
		});
	}

	createActionPlanItem(newRec: ActionPlanItem): Promise<void> {
		const company: Company = this.store.snapshot().app.company;
		return firestore().doc(`companies/${company.id}`).update({
			actionPlanItems: firestore.FieldValue.arrayUnion(newRec)
		});
	}

	async updateActionPlanItem(planItem: ActionPlanItem) {
		const company: Company = this.store.snapshot().app.company;
		const ref: DocumentReference = firestore().doc(`companies/${company.id}`);
		return firestore().runTransaction(async (transaction) => {
			const snap = await ref.get();
			const actionPlanItems = snap.data().actionPlanItems;
			const index = actionPlanItems.findIndex((element) => element.id === planItem.id);
			if (index != -1) {
				actionPlanItems[index] = planItem;
			}
			await ref.update({
				actionPlanItems: actionPlanItems
			});
		});
	}

	deleteActionPlanItem(newRec: ActionPlanItem): Promise<void> {
		const company: Company = this.store.snapshot().app.company;
		return firestore().doc(`companies/${company.id}`).update({
			actionPlanItems: firestore.FieldValue.arrayRemove(newRec)
		});
	}

	deleteActionPlanItemMultiple(newRec: ActionPlanItem[]): Promise<void> {
		const company: Company = this.store.snapshot().app.company;
		return firestore().doc(`companies/${company.id}`).update({
			actionPlanItems: firestore.FieldValue.arrayRemove(...newRec)
		});
	}

	topUp(trans: IGNTransaction) {
		const company: Company = this.store.snapshot().app.company;
	}
}
