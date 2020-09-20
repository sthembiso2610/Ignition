import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEmployeeTypeComponent } from './all-employee-type.component';

describe('AllEmployeeTypeComponent', () => {
  let component: AllEmployeeTypeComponent;
  let fixture: ComponentFixture<AllEmployeeTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllEmployeeTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllEmployeeTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
