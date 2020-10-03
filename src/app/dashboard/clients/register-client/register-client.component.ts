import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientInvite } from 'src/app/models';
import { nameValidator } from 'src/app/services/validators/validators-index';
import { DbService } from 'src/app/services/db.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FlashService } from 'src/app/services/flash.service';
import { DialogService } from 'src/app/services/dialog.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-register-client',
	templateUrl: './register-client.component.html',
	styleUrls: [ './register-client.component.scss' ]
})
export class InviteClientComponent implements OnInit {
	form: FormGroup;
	@ViewChild('formDir') formDir;

	constructor(
		private fb: FormBuilder,
		private db: DbService,
		private dialog: DialogService,
		private loading: NgxSpinnerService,
    private flash: FlashService,
    private router: Router
	) {
		this.form = this.fb.group({
			email: [ '', [ Validators.required, Validators.email ] ],
			name: [ '', [] ]
		});
	}

	controlHasError(controlName: string, validation: string): boolean {
		let control = this.form.controls[controlName];
		if (!control) {
			return false;
		}
		return control.hasError(validation) && (control.dirty || control.touched);
	}

	validateForm() {
		const controls = this.form.controls;
		if (this.form.invalid) {
			Object.keys(controls).forEach((e) => controls[e].markAsTouched());

			return false;
		}

		return true;
	}

	submit() {
		if (this.validateForm()) {
			this.loading.show();
			const invite: ClientInvite = {
				email: this.form.controls['email'].value,
				name: this.form.controls['name'].value
			};
			this.db
				.sendInvite(invite)
				.then(() => {
					this.formDir.resetForm();
					this.loading.hide();
					this.dialog.success('Invite sent, your client should receive an email shortly').then(
            ()=> {
              this.router.navigate([ '/dashboard/clients']);
            }
          )
				})
				.catch((e) => {
					this.loading.hide();
					this.flash.open(e.message, 'danger');
				});
		}
	}

	ngOnInit(): void {}
}
