import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteClientComponent } from './register-client.component';

describe('RegisterClientComponent', () => {
	let component: InviteClientComponent;
	let fixture: ComponentFixture<InviteClientComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [ InviteClientComponent ]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(InviteClientComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
