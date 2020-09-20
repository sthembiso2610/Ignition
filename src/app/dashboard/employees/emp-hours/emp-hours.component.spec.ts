import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpHoursComponent } from './emp-hours.component';

describe('EmpHoursComponent', () => {
  let component: EmpHoursComponent;
  let fixture: ComponentFixture<EmpHoursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpHoursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
