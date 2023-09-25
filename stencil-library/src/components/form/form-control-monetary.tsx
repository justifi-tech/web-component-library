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
  tag: 'form-control-monetary',
  styleUrl: 'form-control-number.scss',
  shadow: true,
})
export class MonetaryInput {
  @Prop() label: string;
  @Prop() name: any;
  @Prop() error: string;
  @Prop() defaultValue: string;
  @Prop() inputHandler: (name: string, value: string) => void;

  private imask: InputMask<any> | null = null;

  textInput!: HTMLInputElement;

  @Event() formControlInput: EventEmitter<any>;
  @Event() formControlBlur: EventEmitter<any>;

  @Watch('defaultValue')
  handleDefaultValueChange(newValue: string) {
    this.updateInput(newValue);
  }

  componentDidLoad() {
    if (this.textInput) {
      this.imask = IMask(this.textInput, {
        mask: Number,
        scale: 2,
        thousandsSeparator: ',',
        padFractionalZeros: true,
        normalizeZeros: true,
        radix: '.',
      });

      this.imask.on('accept', () => {
        const rawValue = this.imask.unmaskedValue;
        this.inputHandler(this.name, rawValue);
      });

      this.textInput.addEventListener('blur', () => {
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
      this.imask.value = String(newValue);
    }
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <label part="label" class="form-label" htmlFor={this.name}>
          {this.label}
        </label>
        <input
          ref={el => (this.textInput = el as HTMLInputElement)}
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
