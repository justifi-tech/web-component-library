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
  tag: 'form-control-monetary'
})
export class MonetaryInput {
  textInput!: HTMLInputElement;
  private imask: InputMask<any> | null = null;

  @Prop() label: string;
  @Prop() name: string;
  @Prop() helpText?: string;
  @Prop() errorText?: string;  
  @Prop() defaultValue: string;
  @Prop() inputHandler: (name: string, value: string) => void;
  @Prop() maskOptions: any = CURRENCY_MASK.DECIMAL;
  @Prop() disabled: boolean;

  @Watch('defaultValue')
  handleDefaultValueChange(newValue: string) {
    this.updateInput(newValue);
  }

  @Event() formControlInput: EventEmitter<any>;
  @Event() formControlBlur: EventEmitter<any>;

  componentDidLoad() {
    this.initializeIMask();
    this.updateInput(this.defaultValue);
  }

  disconnectedCallback() {
    this.imask?.destroy();
  }

  private initializeIMask = () => {
    if (!this.textInput) return;

    this.imask = IMask(this.textInput, this.maskOptions);

    this.imask.on('accept', () => {
      const rawValue = this.imask.unmaskedValue;
      this.inputHandler(this.name, rawValue);
      this.formControlInput.emit({ name: this.name, value: rawValue });
    });

    this.textInput.addEventListener('blur', () => this.formControlBlur.emit());
  }
  
  handleFormControlInput = (event: any) => {
    const target = event.target;
    const name = target.getAttribute('name');
    const rawValue = this.imask.unmaskedValue;
    this.formControlInput.emit({ name: name, value: rawValue });
  }
  
  updateInput = (newValue: any) => {
    if (this.imask) {
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
          <div class="input-group">
            <span class="input-group-text">$</span>
            <input
              ref={el => (this.textInput = el as HTMLInputElement)}
              id={this.name}
              name={this.name}
              onBlur={this.formControlBlur.emit}
              onInput={this.handleFormControlInput}
              part={`input ${this.errorText && 'input-invalid'}`}
              class={this.errorText ? 'form-control monetary is-invalid' : 'form-control monetary'}
              type="text"
              disabled={this.disabled}
            />
          </div>
          <form-control-help-text helpText={this.helpText} name={this.name} />
          <form-control-error-text errorText={this.errorText} name={this.name} />
        </div>
      </Host>
    );
  }
}
