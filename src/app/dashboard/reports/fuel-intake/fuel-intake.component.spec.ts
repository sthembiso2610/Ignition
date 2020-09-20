import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelIntakeComponent } from './fuel-intake.component';

describe('FuelIntakeComponent', () => {
  let component: FuelIntakeComponent;
  let fixture: ComponentFixture<FuelIntakeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelIntakeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelIntakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
