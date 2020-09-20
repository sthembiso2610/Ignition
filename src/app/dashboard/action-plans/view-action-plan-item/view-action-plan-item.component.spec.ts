import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewActionPlanItemComponent } from './view-action-plan-item.component';

describe('ViewActionPlanItemComponent', () => {
  let component: ViewActionPlanItemComponent;
  let fixture: ComponentFixture<ViewActionPlanItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewActionPlanItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewActionPlanItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
