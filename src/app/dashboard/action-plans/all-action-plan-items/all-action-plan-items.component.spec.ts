import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllActionPlanItemsComponent } from './all-action-plan-items.component';

describe('AllActionPlanItemsComponent', () => {
  let component: AllActionPlanItemsComponent;
  let fixture: ComponentFixture<AllActionPlanItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllActionPlanItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllActionPlanItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
