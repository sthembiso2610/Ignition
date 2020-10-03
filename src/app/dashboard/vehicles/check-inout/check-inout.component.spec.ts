import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInoutComponent } from './check-inout.component';

describe('CheckInoutComponent', () => {
  let component: CheckInoutComponent;
  let fixture: ComponentFixture<CheckInoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckInoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckInoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
