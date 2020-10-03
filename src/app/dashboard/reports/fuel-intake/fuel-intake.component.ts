import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Vehicle } from 'src/app/models/vehicle.model';
import {RefuelRecord} from 'src/app/models/RefuelRecord.model'
import {VehicleService} from 'src/app/dashboard/vehicles/vehicle.service'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-fuel-intake',
  templateUrl: './fuel-intake.component.html',
  styleUrls: ['./fuel-intake.component.scss']
})
export class FuelIntakeComponent implements OnInit {

  vehicle: Vehicle
  startdate: Date
  enddate: Date;
  pipe = new DatePipe('en-US');
  adate: Date = new Date();
  tablevisiblity: boolean = false;
  dispaycars: Vehicle;
  summation: any;

  form:FormGroup;
   isLoading = false;
    selected : any;
    cars : Vehicle[] = []
    selectedCar = this.cars;
    fuelRecord: RefuelRecord[] = []
    ref: RefuelRecord[] = [];

    nowdate: Date = new Date( Date.now())
  constructor(private fb:FormBuilder, private service: VehicleService) { }

  ngOnInit(): void {

    this.service.getAll().subscribe(a=>
      {  // this.cars= [];
          a.forEach(
            zz=> {
              let car: any = zz.payload.doc.data()
                car.VehicleID = zz.payload.doc.id
                console.log(car);
                this.cars.push(car)
               console.log(this.adate);
                console.log( this.adate);
            }
          )
      }
    )

    this.service.getRefuel().subscribe(
      a=> {
        a.forEach(
          xx=> {
            let refuel: RefuelRecord = xx.payload.doc.data()
            refuel.refuelRecordID = xx.payload.doc.id;

            this.fuelRecord.push(refuel)
          }
        )
      }
    )


    this.form = this.fb.group({
      Cars: [
        ,
        [Validators.required]
      ],
      startdate: [
        ,
        [Validators.required]
      ],
      endDate: [

        ,Validators.required
      ]

    })
  }



  controlHasError(controlName:string, validation:string):boolean{
    let control = this.form.controls[controlName];
    if (!control) {
      return false;
    }
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  validateForm(){
    const controls =  this.form.controls;
    if(this.form.invalid){
      Object.keys(controls).forEach(e=> controls[e].markAsTouched())

     return false
    }
    return true;

  }


generate(){

  this.ref = []

    if( this.validateForm())
    {

    this.tablevisiblity = false ;
    this.vehicle = this.form.controls['Cars'].value;
    this.startdate = this.form.controls['startdate'].value;
    this.enddate = this.form.controls['endDate'].value

    console.log(this.vehicle, this.startdate, this.enddate)

    let dat = this.pipe.transform(this.fuelRecord[0].refuelRecordDate, 'short')
     this.adate = new Date(dat)
    console.log(this.adate);

      this.fuelRecord.forEach(element => {
        element.vehicleID
          let a:Date = new Date(this.pipe.transform(element.refuelRecordDate,'short'))
       if (element.vehicleID == this.vehicle.id)
       {
        console.log('first')
        if (a >= this.startdate  && a <= this.enddate)
        {
          this.tablevisiblity = true;
          console.log( element, ' made it inside ')
           this.dispaycars = this.cars.find(find=>{ return find.id == element.vehicleID})
            this.ref.push(element)
           this.summation = this.ref.reduce((a,b) => a+ b.liters, 0)
        }

       }

      });


  }
  }


  export(){




    var data = document.getElementById('contentToConvert');

   html2canvas(data).then(canvas => {

     var imgWidth = 208;

     var imgHeight = canvas.height * imgWidth / canvas.width;

     const contentDataURL = canvas.toDataURL('image/png')
    let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
     var position = 0;
     pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
     pdf.save('Refuel.pdf'); // Generated PDF
  });
}


}
