import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasePackageComponent } from './purchase-package.component';

describe('PurchasePackageComponent', () => {
  let component: PurchasePackageComponent;
  let fixture: ComponentFixture<PurchasePackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasePackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasePackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
