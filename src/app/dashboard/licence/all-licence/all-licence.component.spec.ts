import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllLicenceComponent } from './all-licence.component';

describe('AllLicenceComponent', () => {
  let component: AllLicenceComponent;
  let fixture: ComponentFixture<AllLicenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllLicenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllLicenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
