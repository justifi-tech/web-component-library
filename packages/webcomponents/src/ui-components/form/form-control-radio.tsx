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
import {
  inputRadio,
  inputRadioChecked,
  inputRadioCheckedFocused,
  inputRadioFocused,
  inputRadioInvalid,
  label
} from '../../styles/parts';

@Component({
  tag: 'form-control-radio'
})
export class RadioInput {
  radioElement!: HTMLInputElement;

  @State() isFocused: boolean = false;

  @Prop() label: string;
  @Prop() name: any;
  @Prop() value: any;
  @Prop() helpText?: string;
  @Prop() errorText?: string;
  @Prop() checked: boolean;
  @Prop() inputHandler: (value: boolean) => void;
  @Prop() disabled: boolean;

  @Watch('checked')
  handleDefaultValueChange(checked: boolean) {
    this.updateInput(checked);
  }

  @Event() formControlInput: EventEmitter<any>;
  @Event() formControlBlur: EventEmitter<any>;

  componentDidLoad() {
    this.updateInput(this.checked);
  }

  handleFormControlInput = () => {
    this.inputHandler(this.value);
    this.formControlInput.emit({ name: this.name, value: this.value });
  }

  updateInput = (checked: boolean) => {
    if (this.radioElement) {
      this.radioElement.checked = checked;
    }
  }

  private get part() {
    if (this.errorText) {
      return inputRadioInvalid;
    }
    if (this.isFocused) {
      if (this.checked) {
        return inputRadioCheckedFocused;
      }
      return inputRadioFocused;
    }
    if (this.checked) {
      return inputRadioChecked;
    }
    return inputRadio;
  }

  render() {
    return (
      <Host>
        <div class='form-group d-flex flex-column'>
          <div class="form-check">
            <input
              ref={el => (this.radioElement = el as HTMLInputElement)}
              type="radio"
              id={this.name}
              name={this.name}
              onFocus={() => this.isFocused = true}
              onBlur={() => {
                this.isFocused = false;
                this.formControlBlur.emit();
              }}
              onChange={this.handleFormControlInput}
              part={this.part}
              class={this.errorText ? 'form-check-input is-invalid' : 'form-check-input'}
              disabled={this.disabled}
              value={this.value}
            />
            <label class="form-check-label" htmlFor={this.name} part={label}>
              {this.label}
            </label>
          </div>
          <form-control-help-text helpText={this.helpText} name={this.name} />
          <form-control-error-text errorText={this.errorText} name={this.name} />
        </div>
      </Host>
    );
  }
}
