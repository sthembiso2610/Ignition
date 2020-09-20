import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupStepOneComponent } from './setup-step-one.component';

describe('SetupStepOneComponent', () => {
  let component: SetupStepOneComponent;
  let fixture: ComponentFixture<SetupStepOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupStepOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
