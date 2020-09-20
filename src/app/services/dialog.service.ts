import { Injectable } from '@angular/core';
import Swal from 'sweetalert2/src/sweetalert2.js';

@Injectable({
	providedIn: 'root'
})
export class DialogService {
	constructor() {}

	error(message) {
		Swal.fire({
			showCancelButton: false,
			text: message,
			backdrop: `
rgba(0,0,123,0.4)
left top
no-repeat
`,
			icon: 'error'
		});
	}

	success(message: string) {
		return new Promise((resolve, reject) => {
			Swal.fire({
				showCancelButton: false,
				text: message,
				backdrop: `
	rgba(0,0,123,0.4)
	left top
	no-repeat
	`,
				icon: 'success'
			})
				.then(() => {
					resolve();
				})
				.catch((e) => {
					reject(e);
				});
		});
	}

	confirm(message: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			Swal.fire({
				title: 'Are you sure?',
				showCancelButton: true,
				text: message,
				backdrop: `
    rgba(0,0,123,0.4)
    left top
    no-repeat
  `,
				icon: 'question'
			}).then((willDelete) => {
				console.log('response', willDelete);
				if (willDelete.isConfirmed) {
					resolve(true);
				} else {
					resolve(false);
				}
			});
		});
	}
}
