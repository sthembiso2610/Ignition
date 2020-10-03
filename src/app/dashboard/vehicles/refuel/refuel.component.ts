import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { RefuelRecord } from 'src/app/models/RefuelRecord.model';
import { Vehicle } from 'src/app/models/vehicle.model';
import { VehicleService } from '../vehicle.service';

@Component({
  selector: 'app-refuel',
  templateUrl: './refuel.component.html',
  styleUrls: ['./refuel.component.scss']
})
export class RefuelComponent implements OnInit {

  form: FormGroup;
  isLoading = false;

  constructor(
   @Inject(MAT_DIALOG_DATA) public data: Vehicle,
    private dialogRef: MatDialogRef<RefuelComponent>,
    private fb: FormBuilder,
    private service: VehicleService,
    private loading: NgxSpinnerService,
  ) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      liters: [
      //  this.data.Liters, [Validators.required]
      ],
      KMReading:[

      ]
    })

  }

  controlHasError(controlName: string, validation: string): boolean{
    let control = this.form.controls[controlName];
    if( !control){
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

 close(){
  this.dialogRef.close('returned data xx')

 }

 submit(){
  if(this.validateForm()){

    this.loading.show();
    let newRefuel : RefuelRecord = {
      liters: this.form.controls['liters'].value,
      KmReading: this.form.controls['KMReading'].value,
      refuelRecordDate: Date.now(),
      vehicleID: this.data.id
    }
      this.service.Refuel(newRefuel).then(zz=>
        {
          this.loading.hide();
          this.form.reset();
          this.dialogRef.close();
        })


    this.isLoading =  true;
    setTimeout(() =>
    {
    //  this.dialogRef.close(newRefuel);
    }, 5000);

  }
}


}
