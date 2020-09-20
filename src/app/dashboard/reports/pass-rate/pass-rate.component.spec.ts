import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassRateComponent } from './pass-rate.component';

describe('PassRateComponent', () => {
  let component: PassRateComponent;
  let fixture: ComponentFixture<PassRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
