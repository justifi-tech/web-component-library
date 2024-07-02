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

@Component({
  tag: 'form-control-number-masked'
})
export class NumberInputMasked {
  @Prop() label: string;
  @Prop() name: any;
  @Prop() helpText?: string;
  @Prop() errorText?: string;
  @Prop() defaultValue: string;
  @Prop() inputHandler: (name: string, value: string) => void;
  @Prop() mask: string;
  @Prop() disabled: boolean;

  private imask: InputMask<any> | null = null;

  textInput!: HTMLInputElement;

  @Event() formControlInput: EventEmitter<any>;
  @Event() formControlBlur: EventEmitter<any>;

  @Watch('defaultValue')
  handleDefaultValueChange(newValue: string) {
    this.updateInput(newValue);
  }

  componentDidLoad() {
    if (this.textInput && this.mask) {
      this.imask = IMask(this.textInput, {
        mask: this.mask,
      });

      this.imask.on('accept', () => {
        const rawValue = this.imask.unmaskedValue;
        this.inputHandler(this.name, rawValue);
      });

      this.textInput.addEventListener('blur', () => {
        this.formControlBlur.emit();
      });

      this.updateInput(this.defaultValue);
    }
  }

  disconnectedCallback() {
    this.imask?.destroy();
  }

  updateInput(newValue: any) {
    if (this.imask && newValue) {
      this.imask.value = String(newValue);
    }
  }

  handleFormControlInput(event: any) {
    const target = event.target;
    const name = target.getAttribute('name');
    this.formControlInput.emit({ name, value: target.value });
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
            onInput={(event: any) => this.handleFormControlInput(event)}
            onBlur={() => this.formControlBlur.emit()}
            part={`input ${this.errorText && 'input-invalid'}`}
            class={this.errorText ? 'form-control is-invalid' : 'form-control'}
            type="text"
            disabled={this.disabled}
          />
          <form-control-help-text helpText={this.helpText} />
          <form-control-error-text errorText={this.errorText} />
        </div>
      </Host>
    );
  }
}
