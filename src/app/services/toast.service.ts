import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toastState = new Subject<{show: boolean, message: string}>();

  show(message: string) {
    this.toastState.next({ show: true, message });
    setTimeout(() => {
      this.toastState.next({ show: false, message: '' });
    }, 3000); // Se oculta tras 3 segundos
  }
}