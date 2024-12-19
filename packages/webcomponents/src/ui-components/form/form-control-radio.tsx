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
  @Prop() value: string;
  @Prop() helpText?: string;
  @Prop() defaultValue?: string;
  @Prop() inputHandler: (name: string, value: string) => void;
  @Prop() disabled: boolean;
  @Prop() errorText: string;
  @Prop() checked: boolean;

  @Watch('defaultValue')
  handleDefaultValueChange(value: string) {
    this.updateInput(value);
  }

  @Event() formControlInput: EventEmitter<any>;
  @Event() formControlBlur: EventEmitter<any>;

  componentDidLoad() {
    this.updateInput(this.value);
  }

  handleFormControlInput = (event: any) => {
    const target = event.target;
    const name = target.getAttribute('name');
    this.inputHandler(name, target.value);
    this.formControlInput.emit({ name, value: target.value });
  }

  updateInput = (value: string) => {
    if (this.defaultValue == value) {
      this.radioElement.checked = true;
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
              id={`${this.name}-${this.value}`}
              name={this.name}
              onFocus={() => this.isFocused = true}
              onBlur={() => {
                this.isFocused = false;
                this.formControlBlur.emit();
              }}
              onInput={this.handleFormControlInput}
              part={this.part}
              class={this.errorText ? 'form-check-input is-invalid' : 'form-check-input'}
              disabled={this.disabled}
              value={this.value}
            />
            <label class="form-check-label" htmlFor={this.name} part={label}>
              {this.label}
            </label>
          </div>
        </div>
      </Host>
    );
  }
}
