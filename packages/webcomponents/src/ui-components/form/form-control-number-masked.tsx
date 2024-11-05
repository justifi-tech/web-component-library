import {
  Component,
  Host,
  h,
  Prop,
  Event,
  EventEmitter,
  Watch,
} from '@stencil/core';
import IMask, { InputMask } from 'imask';
import { FormControlHelpText, FormControlErrorText } from '../../ui-components';

@Component({
  tag: 'form-control-number-masked'
})
export class NumberInputMasked {
  textInput!: HTMLInputElement;
  private imask: InputMask<any> | null = null;

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
    this.formControlInput.emit({ name: name, value: target.value });
  }

  updateInput = (newValue: any) => {
    if (this.imask && newValue) {
      this.imask.value = String(newValue);
    }
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <div class="form-group d-flex flex-column">
          <label part="label" class="form-label" htmlFor={this.name}>
            {this.label}
          </label>
          <input
            ref={el => (this.textInput = el as HTMLInputElement)}
            id={this.name}
            name={this.name}
            onBlur={this.formControlBlur.emit}
            onInput={this.handleFormControlInput}
            part={`input ${this.errorText && 'input-invalid'}`}
            class={this.errorText ? 'form-control is-invalid' : 'form-control'}
            type="text"
            disabled={this.disabled}
          />
          <FormControlHelpText helpText={this.helpText} name={this.name} />
          <FormControlErrorText errorText={this.errorText} name={this.name} />
        </div>
      </Host>
    );
  }
}
