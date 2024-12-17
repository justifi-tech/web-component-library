import {
  Component,
  Host,
  h,
  Prop,
  Event,
  EventEmitter,
  Watch,
} from '@stencil/core';
import { FormControlErrorText } from '../../ui-components';

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
  @Prop() showTime?: boolean;
  @Prop() maxDate?: string = this.currentDate;

  @Watch('defaultValue')
  handleDefaultValueChange(newValue: string) {
    this.updateInput(newValue);
  }

  @Event() formControlInput: EventEmitter<any>;
  @Event() formControlBlur: EventEmitter<any>;

  get currentDate() {
    if (!this.showTime) {
      return new Date().toISOString().split('T')[0];
    } else {
      return new Date().toISOString().slice(0, 16);
    }
  }

  componentDidLoad() {
    this.updateInput(this.defaultValue);
  }

  handleFormControlInput = (event: any) => {
    const dateValue = event.target.value;

    this.inputHandler(this.name, dateValue);
    this.formControlInput.emit({ name: this.name, value: dateValue });
  }

  updateInput(value: any) {
    this.dateInput.value = value;
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <div class="form-group d-flex flex-column">
          <div class="d-flex gap-2">
            <label part="label" class="form-label" htmlFor={this.name}>
              {this.label}
            </label>
            <form-control-tooltip helpText={this.helpText} />
          </div>
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
          <FormControlErrorText errorText={this.errorText} name={this.name} />
        </div>
      </Host>
    );
  }
}
