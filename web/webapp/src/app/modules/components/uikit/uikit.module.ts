import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIkitRoutingModule } from './uikit-routing.module';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  imports: [CommonModule, UIkitRoutingModule],
  declarations: [SpinnerComponent],
  exports: [SpinnerComponent],
})
export class UIkitModule {}
