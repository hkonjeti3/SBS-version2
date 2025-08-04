import { Directive, Input } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[passwordMatch]',
  providers: [{ provide: NG_VALIDATORS, useExisting: PasswordMatchDirective, multi: true }]
})
export class PasswordMatchDirective implements Validator {
  @Input('passwordMatch') passwordMatch: string = '';

  validate(control: AbstractControl): { [key: string]: any } | null {
    const password = control.value;
    const confirmPassword = control.parent?.get(this.passwordMatch)?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { 'passwordMismatch': true };
    }

    return null;
  }
}

export function passwordMatchValidator(control: AbstractControl): { [key: string]: any } | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (password && confirmPassword && password !== confirmPassword) {
    return { 'passwordMismatch': true };
  }

  return null;
}