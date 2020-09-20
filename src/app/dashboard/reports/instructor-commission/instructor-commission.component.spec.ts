import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorCommissionComponent } from './instructor-commission.component';

describe('InstructorCommissionComponent', () => {
  let component: InstructorCommissionComponent;
  let fixture: ComponentFixture<InstructorCommissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructorCommissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorCommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
