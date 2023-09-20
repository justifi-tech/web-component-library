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
  tag: 'form-control-datepart',
  styleUrl: 'form-control-number.scss',
  shadow: true,
})
export class DatePartInput {
  @Element() el: HTMLElement;

  @Prop() label: string;
  @Prop() name: string;
  @Prop() error: string;
  @Prop() defaultValue: string;
  @Prop() type: 'day' | 'month' | 'year';
  @Prop() inputHandler: (name: string, value: string) => void;
  @Prop() disabled: boolean;

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
      let maskOptions;

      switch (this.type) {
        case 'day':
          maskOptions = { mask: Number, min: 1, max: 31 };
          break;
        case 'month':
          maskOptions = { mask: Number, min: 1, max: 12 };
          break;
        case 'year':
          maskOptions = {
            mask: Number,
            min: 1900,
            max: new Date().getFullYear(),
          };
          break;
        default:
          throw new Error('Invalid type prop');
      }

      this.imask = IMask(inputElement, maskOptions);

      this.imask.on('accept', () => {
        const rawValue = this.imask.unmaskedValue;
        this.inputHandler(this.name, rawValue);
      });

      inputElement.addEventListener('blur', () => {
        this.formControlBlur.emit();
      });

      this.updateInput(this.defaultValue);
    }
  }

  updateInput(newValue: any) {
    if (this.imask) {
      this.imask.value = newValue;
    }
  }

  disconnectedCallback() {
    this.imask?.destroy();
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
          disabled={this.disabled}
        />
        {this.error && <div class="invalid-feedback">{this.error}</div>}
      </Host>
    );
  }
}
