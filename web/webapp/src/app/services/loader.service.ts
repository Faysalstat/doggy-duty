import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private requestCount = 0;
  isLoading = new BehaviorSubject<boolean>(false);

  show(): void {
    this.requestCount++;
    this.isLoading.next(true);
  }

  hide(): void {
    this.requestCount = Math.max(this.requestCount - 1, 0);
    if (this.requestCount === 0) {
      this.isLoading.next(false);
    }
  }
}
