import {
  Component,
  Host,
  h,
  Prop,
  Event,
  EventEmitter,
  Element,
  Watch,
} from '@stencil/core';
import IMask, { InputMask } from 'imask';

@Component({
  tag: 'form-control-monetary',
  styleUrl: 'form-control-number.scss',
  shadow: true,
})
export class MonetaryInput {
  @Element() el: HTMLElement;

  @Prop() label: string;
  @Prop() name: any;
  @Prop() error: string;
  @Prop() defaultValue: string;
  @Prop() inputHandler: (name: string, value: string) => void;

  private imask: InputMask<any> | null = null;

  @Event() formControlInput: EventEmitter<any>;
  @Event() formControlBlur: EventEmitter<any>;

  @Watch('defaultValue')
  handleDefaultValueChange(newValue: string) {
    this.updateInput(newValue);
  }

  componentDidLoad() {
    const inputElement = this.el.shadowRoot.querySelector('input');
    if (inputElement) {
      this.imask = IMask(inputElement, {
        mask: Number,
        scale: 2,
        thousandsSeparator: ',',
        padFractionalZeros: true,
        normalizeZeros: true,
        radix: '.',
      });

      this.imask.on('accept', () => {
        const rawValue = this.imask.unmaskedValue;
        console.log('emitting accept with value:', rawValue); // Debug log
        this.inputHandler(this.name, rawValue);
      });

      inputElement.addEventListener('blur', () => {
        console.log('emitting blur event'); // Debug log
        this.formControlBlur.emit();
      });
    }
    this.updateInput(this.defaultValue);
  }

  disconnectedCallback() {
    this.imask?.destroy();
  }

  updateInput(newValue: any) {
    if (this.imask) {
      this.imask.value = newValue;
    }
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <label part="label" class="form-label" htmlFor={this.name}>
          {this.label}
        </label>
        <input
          id={this.name}
          name={this.name}
          onBlur={() => this.formControlBlur.emit()}
          part={`input ${this.error && 'input-invalid'}`}
          class={this.error ? 'form-control is-invalid' : 'form-control'}
          type="text"
        />
        {this.error && <div class="invalid-feedback">{this.error}</div>}
      </Host>
    );
  }
}
