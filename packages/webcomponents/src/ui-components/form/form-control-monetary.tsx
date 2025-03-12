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
import { FormControlErrorText } from '..';
import { input, inputDisabled, inputFocused, inputInvalid, label } from '../../styles/parts';
import { formatCurrencyNoSymbols } from '../../utils/utils';

@Component({
  tag: 'form-control-monetary'
})
export class MonetaryInput {
  formControl!: HTMLInputElement;

  @State() isFocused: boolean = false;

  @Prop() name: any;
  @Prop() label: string;
  @Prop() inputHandler: (name: string, value: string) => void;
  @Prop() defaultValue?: string;
  @Prop() helpText?: string;
  @Prop() errorText?: string;
  @Prop() maxLength?: number;
  @Prop() keyDownHandler?: (event: any) => void;
  @Prop() disabled?: boolean;

  @Watch('defaultValue')
  handleDefaultValueChange(newValue: string) {
    this.updateInput(newValue);
  }

  @Event() formControlInput: EventEmitter<any>;
  @Event() formControlBlur: EventEmitter<any>;

  componentDidLoad() {
    this.updateInput(this.defaultValue);
  }

  formatRawValue = (value: string) => {
    // Remove everything from that is not a number.
    // This will parse out our display formatting as well as prevent users from entering non-numeric characters.
    const formattedValue = value.replace(/\D/g, '');
    return formattedValue;
  }

  formatDisplayValue = (value: string) => {
    return formatCurrencyNoSymbols(+value);
  }

  updateInput = (newValue: any) => {
    const name = this.formControl.name;
    const formatRawValue = this.formatRawValue(newValue); // "100000"
    this.formControl.value = this.formatDisplayValue(formatRawValue); // "1,000.00"

    this.inputHandler(name, formatRawValue);
    this.formControlInput.emit({ name: name, value: formatRawValue });
  }

  private get part() {
    if (this.errorText) {
      return inputInvalid;
    }
    if (this.disabled) {
      return inputDisabled;
    }
    if (this.isFocused) {
      return inputFocused;
    }
    return input;
  }

  render() {
    return (
      <Host>
        <div class="form-group d-flex flex-column">
          <div class="d-flex align-items-start gap-2">
            <label part={label} class="form-label" htmlFor={this.name}>
              {this.label}
            </label>
            <form-control-tooltip helpText={this.helpText} />
          </div>
          <input
            ref={el => this.formControl = el}
            id={this.name}
            name={this.name}
            onFocus={() => this.isFocused = true}
            onBlur={() => {
              this.isFocused = false;
              this.formControlBlur.emit();
            }}
            onInput={(event: Event) => this.updateInput((event.target as HTMLInputElement).value)}
            onKeyDown={this.keyDownHandler}
            onPaste={this.keyDownHandler}
            maxLength={this.maxLength}
            part={this.part}
            class={this.errorText ? "form-control is-invalid" : "form-control"}
            type="text"
            disabled={this.disabled}
          />
          <FormControlErrorText errorText={this.errorText} name={this.name} />
        </div>
      </Host>
    );
  }
}
