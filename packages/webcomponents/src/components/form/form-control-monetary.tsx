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
import { CURRENCY_MASK } from '../../utils/form-input-masks';

@Component({
  tag: 'form-control-monetary',
  styleUrl: 'form-control-number.scss',
  shadow: true,
})
export class MonetaryInput {
  @Prop() label: string;
  @Prop() name: string;
  @Prop() error: string;
  @Prop() defaultValue: string;
  @Prop() inputHandler: (name: string, value: string) => void;
  @Prop() maskOptions: any = CURRENCY_MASK.DECIMAL;

  private imask: InputMask<any> | null = null;

  textInput!: HTMLInputElement;

  @Event() formControlInput: EventEmitter<any>;
  @Event() formControlBlur: EventEmitter<any>;

  @Watch('defaultValue')
  handleDefaultValueChange(newValue: string) {
    this.updateInput(newValue);
  }

  componentDidLoad() {
    this.initializeIMask();
    this.updateInput(this.defaultValue);
  }

  disconnectedCallback() {
    this.imask?.destroy();
  }

  private initializeIMask() {
    if (!this.textInput) return;

    this.imask = IMask(this.textInput, this.maskOptions);

    this.imask.on('accept', () => {
      const rawValue = this.imask.unmaskedValue;
      this.inputHandler(this.name, rawValue);
      this.formControlInput.emit({ name: this.name, value: rawValue });
    });

    this.textInput.addEventListener('blur', () => this.formControlBlur.emit());
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
