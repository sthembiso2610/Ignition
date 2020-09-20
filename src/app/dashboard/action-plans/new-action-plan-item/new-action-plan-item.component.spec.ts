import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewActionPlanItemComponent } from './new-action-plan-item.component';

describe('NewActionPlanItemComponent', () => {
  let component: NewActionPlanItemComponent;
  let fixture: ComponentFixture<NewActionPlanItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewActionPlanItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewActionPlanItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
