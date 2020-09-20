import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientVirtualWalletComponent } from './client-virtual-wallet.component';

describe('ClientVirtualWalletComponent', () => {
  let component: ClientVirtualWalletComponent;
  let fixture: ComponentFixture<ClientVirtualWalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientVirtualWalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientVirtualWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
