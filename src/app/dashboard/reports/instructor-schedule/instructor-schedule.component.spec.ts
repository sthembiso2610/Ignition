import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorScheduleComponent } from './instructor-schedule.component';

describe('InstructorScheduleComponent', () => {
  let component: InstructorScheduleComponent;
  let fixture: ComponentFixture<InstructorScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructorScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
