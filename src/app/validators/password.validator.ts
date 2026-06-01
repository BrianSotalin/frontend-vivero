import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  const errors: ValidationErrors = {};

  if (value.length < 8) errors['minlength'] = true;
  if (!/[A-Z]/.test(value)) errors['noMayuscula'] = true;
  if (!/[a-z]/.test(value)) errors['noMinuscula'] = true;
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) errors['noEspecial'] = true;

  return Object.keys(errors).length ? errors : null;
}