import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmployeeTypeComponent } from './view-employee-type.component';

describe('ViewEmployeeTypeComponent', () => {
  let component: ViewEmployeeTypeComponent;
  let fixture: ComponentFixture<ViewEmployeeTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEmployeeTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEmployeeTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
