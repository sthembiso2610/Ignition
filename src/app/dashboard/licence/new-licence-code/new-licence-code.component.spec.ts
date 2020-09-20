import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLicenceCodeComponent } from './new-licence-code.component';

describe('NewLicenceCodeComponent', () => {
  let component: NewLicenceCodeComponent;
  let fixture: ComponentFixture<NewLicenceCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewLicenceCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLicenceCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
