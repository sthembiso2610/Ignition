import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-setup-step-one',
  templateUrl: './setup-step-one.component.html',
  styleUrls: ['./setup-step-one.component.scss']
})
export class SetupStepOneComponent implements OnInit {

  form:FormGroup;

  constructor(private fb:FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name:[
        '',
        [
          Validators.required
        ]
      ]
    })
  }

}
