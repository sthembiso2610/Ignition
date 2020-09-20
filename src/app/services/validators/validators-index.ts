import { AbstractControl } from '@angular/forms';

export function nameValidator(control: AbstractControl): { [key: string]: any } | null {
	const names: string[] = control.value.split(' ');
	if (names.length != 2) {
		return { invalidName: true }; // return object if the validation is not passed.
	}
	return null; // return null if validation is passed.
}
