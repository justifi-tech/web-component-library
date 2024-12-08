import {
  Component,
  Host,
  h,
  Prop,
  Event,
  EventEmitter,
  Watch,
  State,
} from '@stencil/core';
import { FormControlErrorText } from '../../ui-components';
import { FormLabel } from './form-helpers/form-label';

@Component({
  tag: 'form-control-date'
})
export class DateInput {
  dateInput!: HTMLInputElement;

  @State() isFocused: boolean = false;

  @Prop() name: string;
  @Prop() label: string;
  @Prop() inputHandler: (name: string, value: string) => void;
  @Prop() defaultValue?: string;
  @Prop() helpText?: string;
  @Prop() errorText?: string;
  @Prop() disabled?: boolean;
  @Prop() filterTimeZone?: boolean = false;
  @Prop() showTime?: boolean;
  @Prop() maxDate?: string = this.currentDate;

  @Watch('defaultValue')
  handleDefaultValueChange(newValue: string) {
    if (this.filterTimeZone) {
      this.updateInput(this.convertToLocal(newValue));
    } else {
      this.updateInput(newValue);
    }
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
    if (this.filterTimeZone) {
      this.updateInput(this.convertToLocal(this.defaultValue));
    } else {
      this.updateInput(this.defaultValue);
    }
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

  convertToLocal(value: string): string {
    if (!value) return value;
    const date = new Date(value);

    // Adjust the date to the local timezone
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

    return this.showTime ? localDate.toISOString().slice(0, 16) : localDate.toISOString().split('T')[0];
  }

  private get part(): string {
    let part = 'input';
    if (this.errorText) {
      part += ' input-invalid';
    }
    if (this.disabled) {
      part += ' input-disabled';
    }
    if (this.isFocused) {
      part += ' input-focused';
    }
    return part;
  }

  render() {
    return (
      <Host>
        <div class="form-group d-flex flex-column">
          <FormLabel
            htmlFor={this.name}
            label={this.label}
            helpText={this.helpText}
          />
          <input
            type={this.showTime ? 'datetime-local' : 'date'} // Conditionally set the input type
            ref={el => (this.dateInput = el as HTMLInputElement)}
            id={this.name}
            name={this.name}
            onFocus={() => { this.isFocused = true; }}
            onBlur={() => {
              this.isFocused = false;
              this.formControlBlur.emit();
            }}
            onInput={this.handleFormControlInput}
            part={this.part}
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
