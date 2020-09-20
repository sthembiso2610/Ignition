import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupStepTwoComponent } from './setup-step-two.component';

describe('SetupStepTwoComponent', () => {
  let component: SetupStepTwoComponent;
  let fixture: ComponentFixture<SetupStepTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupStepTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupStepTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
