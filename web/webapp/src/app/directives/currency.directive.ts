import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appCurrency]',
})
export class CurrencyDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.applyStyles();
  }

  private applyStyles() {
    this.renderer.setStyle(this.el.nativeElement, 'color', 'green');
    this.renderer.setStyle(this.el.nativeElement, 'font-weight', 'bold');
  }

  // @HostListener('input', ['$event.target.value'])
  // onInput(value: string) {
  //   const formattedValue = parseFloat(value).toFixed(2);
  //   this.renderer.setProperty(this.el.nativeElement, 'value', formattedValue);
  // }
}
