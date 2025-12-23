import {
  Component,
  Host,
  h,
  Prop,
  Event,
  EventEmitter,
  Element,
  Watch,
  State,
} from '@stencil/core';
import { FormControlErrorText, FormControlHelpText } from '../../ui-components';
import { input, inputFocused, inputInvalid, inputInvalidAndFocused, label } from '../../styles/parts';

@Component({
  tag: 'form-control-number'
})
export class NumberInput {
  @Element() el: HTMLElement;

  @State() isFocused: boolean = false;

  @Prop() label: string;
  @Prop() name: any;
  @Prop() helpText?: string;
  @Prop() errorText?: string;
  @Prop() defaultValue: string;
  @Prop() inputHandler: (name: string, value: string) => void;
  @Prop() disabled: boolean;

  @Watch('defaultValue')
  handleDefaultValueChange(newValue: string) {
    this.updateInput(newValue);
  }

  @Event() formControlInput: EventEmitter<any>;
  @Event() formControlBlur: EventEmitter<any>;

  componentDidLoad() {
    this.updateInput(this.defaultValue);
  }

  handleFormControlInput = (event: any) => {
    const target = event.target;
    const name = target.getAttribute('name');
    this.inputHandler(name, target.value);
    this.formControlInput.emit({ name, value: target.value });
  }

  updateInput = (newValue: any) => {
    const inputElement = this.el.querySelector('input');
    if (inputElement) {
      inputElement.value = newValue || '';
    }
  }

  private get part() {
    if (this.isFocused && this.errorText) {
      return inputInvalidAndFocused;
    }
    if (this.isFocused) {
      return inputFocused;
    }
    if (this.errorText) {
      return inputInvalid
    }
    return input;
  }

  render() {
    return (
      <Host>
        <div class='form-group d-flex flex-column'>
          <label part={label} class="form-label" htmlFor={this.name}>
            {this.label}
          </label>
          <input
            id={this.name}
            name={this.name}
            onFocus={() => this.isFocused = true}
            onBlur={() => {
              this.isFocused = false;
              this.formControlBlur.emit();
            }}
            onInput={this.handleFormControlInput}
            part={this.part}
            class={this.errorText ? 'form-control is-invalid' : 'form-control'}
            type="number"
            disabled={this.disabled}
          />
          <FormControlHelpText helpText={this.helpText} name={this.name} />
          <FormControlErrorText errorText={this.errorText} name={this.name} />
        </div>
      </Host>
    );
  }
}
