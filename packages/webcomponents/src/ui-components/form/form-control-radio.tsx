import {
  Component,
  Host,
  h,
  Prop,
  Event,
  EventEmitter,
  State,
} from '@stencil/core';
import {
  inputRadio,
  inputRadioChecked,
  inputRadioCheckedFocused,
  inputRadioFocused,
  inputRadioInvalid,
  label
} from '../../styles/parts';

@Component({
  tag: 'form-control-radio',
})
export class RadioInput {
  radioElement!: HTMLInputElement;

  @State() isFocused: boolean = false;

  @Prop() label: any;
  @Prop() name: any;
  @Prop() value: string;
  @Prop() helpText?: string;
  @Prop() inputHandler: (name: string, value: string) => void;
  @Prop() disabled: boolean;
  @Prop() errorText: string;
  @Prop() checked: boolean;

  @Event() formControlInput: EventEmitter<any>;
  @Event() formControlBlur: EventEmitter<any>;

  handleFormControlInput = (event: any) => {
    const target = event.target;
    const name = target.getAttribute('name');
    this.inputHandler(name, this.value);
    this.formControlInput.emit({ name, value: this.value });
  }

  private get part() {
    if (this.errorText) {
      return inputRadioInvalid;
    }

    if (this.isFocused && this.checked) {
      return inputRadioCheckedFocused;
    }

    if (this.checked) {
      return inputRadioChecked;
    }

    if (this.isFocused) {
      return inputRadioFocused;

    }
    return inputRadio;
  }

  render() {
    return (
      <Host class='form-group d-flex flex-column'>
        <div class="form-check">
          <input
            ref={el => (this.radioElement = el as HTMLInputElement)}
            type="radio"
            id={`${this.name}-${this.value}`}
            name={this.name}
            onFocus={() => this.isFocused = true}
            onBlur={() => {
              this.isFocused = false;
              this.formControlBlur.emit();
            }}
            onChange={this.handleFormControlInput}
            part={this.part}
            class={this.errorText ? 'form-check-input is-invalid' : 'form-check-input'}
            disabled={this.disabled}
            value={this.value}
            checked={this.checked}
          />
          <label
            class="form-check-label"
            htmlFor={`${this.name}-${this.value}`}
            part={label}
          >
            {this.label}
          </label>
        </div>
        <form-control-help-text helpText={this.helpText} name={this.name} />
        <form-control-error-text errorText={this.errorText} name={this.name} />
      </Host>
    );
  }
}
