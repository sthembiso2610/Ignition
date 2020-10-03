import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { RefuelRecord } from 'src/app/models/RefuelRecord.model';
import { IGNUser } from 'src/app/models/user.model';
import { Vehicle } from 'src/app/models/vehicle.model';
import { DbService } from 'src/app/services/db.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {


  VehicleID: any;
  Vehicle: Vehicle = {id: null};

  constructor( public firestore: AngularFirestore, private service: DbService) { }

  company: IGNUser = this.service.User
  addVehicle(avehicle: Vehicle): Promise<any>
  {
    //const vehiclejson = JSON.stringify(avehicle)
    return this.firestore.collection('Vehicle').add(avehicle).then(docRef =>
      this.VehicleID = docRef.id);

  }

  updateVehicle(updated: Vehicle)
  {
    //return this.firestore.doc('Vehicle/' + updated.id).update(updated);
    return this.firestore.doc(`companies/${this.company.companyID}/vehicles/${updated.id}`).update(updated)
  }

  deleteVehicle(vehicle: Vehicle)
  {
    return this.firestore.doc('Vehicle/' + vehicle.id).delete();

  }



  getAll()
  {

    return this.firestore.collection(`companies/${this.company.companyID}/vehicles`).snapshotChanges()
  }

  Refuel(refuel: RefuelRecord)
  {
    console.log(refuel)
    return this.firestore.collection(`companies/${this.company.companyID}/RefuelRecord`).add(refuel);
  }

  getRefuel(){
    return this.firestore.collection(`companies/${this.company.companyID}/RefuelRecord`).snapshotChanges()
  }

}
