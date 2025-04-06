import { Directive, ElementRef, HostListener, Input, Renderer2, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import * as moment from 'moment';

@Directive({
  selector: '[appDateOnly]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DateOnlyDirective),
    multi: true
  }]
})
export class DateOnlyDirective implements ControlValueAccessor {
  @Input() appDateOnly: boolean = true;
  private onChange: any = () => {};
  private onTouched: any = () => {};

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('change', ['$event.target.value'])
  handleChange(value: string) {
    if (this.appDateOnly && value) {
      const formattedDate = moment(value).format('YYYY-MM-DD');
      this.renderer.setProperty(this.el.nativeElement, 'value', formattedDate);
      this.onChange(formattedDate);
    }
  }

  writeValue(value: any): void {
    if (value) {
      const formattedDate = moment(value).format('YYYY-MM-DD');
      this.renderer.setProperty(this.el.nativeElement, 'value', formattedDate);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
