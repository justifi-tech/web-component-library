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
import IMask, { InputMask } from 'imask';
import { FormControlErrorText } from '../../ui-components';
import { input, inputDisabled, inputFocused, inputInvalid, label } from '../../styles/parts';

@Component({
  tag: 'form-control-number-masked'
})
export class NumberInputMasked {
  textInput!: HTMLInputElement;
  private imask: InputMask<any> | null = null;

  @State() isFocused: boolean = false;

  @Prop() label: string;
  @Prop() name: any;
  @Prop() helpText?: string;
  @Prop() errorText?: string;
  @Prop() defaultValue: string;
  @Prop() inputHandler: (name: string, value: string) => void;
  @Prop() mask: string;
  @Prop() disabled: boolean;

  @Watch('defaultValue')
  handleDefaultValueChange(newValue: string) {
    this.initializeIMask();
    this.updateInput(newValue);
  }

  @Event() formControlInput: EventEmitter<any>;
  @Event() formControlBlur: EventEmitter<any>;

  disconnectedCallback() {
    this.imask?.destroy();
  }

  componentDidLoad() {
    if (this.textInput) {
      this.initializeIMask();
      this.updateInput(this.defaultValue);
    }
  }

  private initializeIMask = () => {
    if (!this.textInput) return;

    this.imask = IMask(this.textInput, {
      mask: this.mask,
    });

    this.imask.on('accept', () => {
      const rawValue = this.imask?.unmaskedValue;
      if (rawValue !== undefined) {
        this.inputHandler(this.name, rawValue);
      }
    });

    this.textInput.addEventListener('blur', () => this.formControlBlur.emit());
  }

  handleFormControlInput = (event: any) => {
    const target = event.target;
    const name = target.getAttribute('name');
    const rawValue = this.imask?.unmaskedValue || target.value;
    this.formControlInput.emit({ name: name, value: rawValue });
  }

  updateInput = (newValue: any) => {
    if (this.imask && newValue) {
      this.imask.value = String(newValue);
    }
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
            ref={el => (this.textInput = el as HTMLInputElement)}
            id={this.name}
            name={this.name}
            onFocus={() => (this.isFocused = true)}
            onBlur={() => {
              this.isFocused = false;
              this.formControlBlur.emit();
            }}
            onInput={this.handleFormControlInput}
            part={this.part}
            class={this.errorText ? 'form-control is-invalid' : 'form-control'}
            type="text"
            disabled={this.disabled}
          />
          <FormControlErrorText errorText={this.errorText} name={this.name} />
        </div>
      </Host>
    );
  }
}
