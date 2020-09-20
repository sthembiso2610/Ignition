import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEmpTypeComponent } from './new-emp-type.component';

describe('NewEmpTypeComponent', () => {
  let component: NewEmpTypeComponent;
  let fixture: ComponentFixture<NewEmpTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewEmpTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEmpTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
