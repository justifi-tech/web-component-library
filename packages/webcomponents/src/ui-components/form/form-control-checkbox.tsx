import {
  Component,
  Host,
  h,
  Prop,
  Event,
  EventEmitter,
  State,
} from '@stencil/core';
import { FormControlHelpText, FormControlErrorText } from '../../ui-components';
import { inputCheckbox, inputCheckboxChecked, inputCheckboxCheckedFocused, inputCheckboxFocused, inputCheckboxInvalid, label } from '../../styles/parts';

@Component({
  tag: 'form-control-checkbox',
})
export class CheckboxInput {
  checkboxElement!: HTMLInputElement;

  @State() isFocused: boolean = false;

  @Prop() label: string;
  @Prop() name: any;
  @Prop() helpText?: string;
  @Prop() errorText?: string;
  @Prop() checked: boolean;
  @Prop() inputHandler: (name: string, value: boolean) => void;
  @Prop() disabled: boolean;

  @Event() formControlInput: EventEmitter<any>;
  @Event() formControlBlur: EventEmitter<any>;

  handleFormControlInput = (event: any) => {
    event.preventDefault();
    const target = event.target;
    const name = target.getAttribute('name');
    this.inputHandler(name, target.checked);
    this.formControlInput.emit({ name, value: target.value });
  }

  updateInput = (newValue: any) => {
    this.checkboxElement.checked = newValue;
  }

  private get part() {
    if (this.errorText) {
      return inputCheckboxInvalid;
    }
    if (this.isFocused && this.checked) {
      return inputCheckboxCheckedFocused;
    }
    if (this.isFocused) {
      return inputCheckboxFocused;
    }
    if (this.checked) {
      return inputCheckboxChecked;
    }
    return inputCheckbox;
  }

  render() {
    return (
      <Host>
        <div class='form-group d-flex flex-column'>
          <div class="form-check">
            <input
              ref={el => (this.checkboxElement = el as HTMLInputElement)}
              type="checkbox"
              id={this.name}
              name={this.name}
              onFocus={() => this.isFocused = true}
              onBlur={() => {
                this.isFocused = false;
                this.formControlBlur.emit();
              }}
              onInput={this.handleFormControlInput}
              part={this.part}
              class={this.errorText ? 'form-check-input is-invalid' : 'form-check-input'}
              disabled={this.disabled}
              checked={this.checked}
            />
            <label class="form-check-label" htmlFor={this.name} part={label}>
              {this.label}
            </label>
          </div>
          <FormControlHelpText helpText={this.helpText} name={this.name} />
          <FormControlErrorText errorText={this.errorText} name={this.name} />
        </div>
      </Host>
    );
  }
}
