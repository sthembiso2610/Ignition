import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllServiceItemsComponent } from './all-service-items.component';

describe('AllServiceItemsComponent', () => {
  let component: AllServiceItemsComponent;
  let fixture: ComponentFixture<AllServiceItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllServiceItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllServiceItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
