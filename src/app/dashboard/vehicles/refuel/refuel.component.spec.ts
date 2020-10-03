import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefuelComponent } from './refuel.component';

describe('RefuelComponent', () => {
  let component: RefuelComponent;
  let fixture: ComponentFixture<RefuelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefuelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
