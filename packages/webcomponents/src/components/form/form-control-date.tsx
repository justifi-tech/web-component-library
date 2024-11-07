import {
  Component,
  Host,
  h,
  Prop,
  Event,
  EventEmitter,
  Watch,
} from '@stencil/core';

@Component({
  tag: 'form-control-date'
})
export class DateInput {
  dateInput!: HTMLInputElement;

  @Prop() name: string;
  @Prop() label: string;
  @Prop() inputHandler: (name: string, value: string) => void;
  @Prop() defaultValue?: string;
  @Prop() helpText?: string;
  @Prop() errorText?: string;
  @Prop() disabled?: boolean;
  @Prop() filterTimeZone?: boolean = false;
  @Prop() showTime?: boolean;
  
  @Watch('defaultValue')
  handleDefaultValueChange(newValue: string) {
    this.updateInput(this.convertToStandardDate(newValue));
  }

  @Event() formControlInput: EventEmitter<any>;
  @Event() formControlBlur: EventEmitter<any>;

  get maxDate() {
    if (!this.showTime) {
      return new Date().toISOString().split('T')[0];
    } else {
      return new Date().toISOString().slice(0, 16);
    }
  }

  componentDidLoad() {
    this.updateInput(this.convertToStandardDate(this.defaultValue));
  }
  
  handleFormControlInput = (event: any) => {
    const target = event.target;
    const localValue = target.value;

    if (this.filterTimeZone) {
      const utcDate = this.convertToUTC(localValue);
      this.inputHandler(this.name, utcDate);
      this.formControlInput.emit({ name: this.name, value: utcDate });
    } else {
      this.inputHandler(this.name, localValue);
      this.formControlInput.emit({ name: this.name, value: localValue });
    }
  }
   
  updateInput(value: any) {
    this.dateInput.value = value;
  }

  convertToUTC(value: string): string {
    const dateObj = new Date(value);
    return new Date(dateObj.toUTCString()).toISOString();
  }

  convertToStandardDate(value: string): string {
    if (!value) return value;
    const date = new Date(value);
  
    // Adjust the date to the local timezone
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  
    return this.showTime ? localDate.toISOString().slice(0, 16) : localDate.toISOString().split('T')[0];
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <label part="label" class="form-label" htmlFor={this.name}>
          {this.label}
        </label>
        <input
          type={this.showTime ? 'datetime-local' : 'date'} // Conditionally set the input type
          ref={el => (this.dateInput = el as HTMLInputElement)}
          id={this.name}
          name={this.name}
          onBlur={this.formControlBlur.emit}
          onInput={this.handleFormControlInput}
          part={`input ${this.errorText && 'input-invalid'}`}
          class={this.errorText ? 'form-control is-invalid' : 'form-control'}
          disabled={this.disabled}
          max={this.maxDate}
        />
        <form-control-help-text helpText={this.helpText} name={this.name} />
        <form-control-error-text errorText={this.errorText} name={this.name} />     
      </Host>
    );
  }
}
