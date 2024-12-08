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
import { FormControlErrorText } from '../../ui-components';
import { FormLabel } from './form-helpers/form-label';

@Component({
  tag: 'form-control-select'
})
export class SelectInput {
  selectElement!: HTMLSelectElement;

  @State() isFocused: boolean = false;

  @Prop() name: any;
  @Prop() label: string;
  @Prop() options: { label: string; value: string }[];
  @Prop() inputHandler: (name: string, value: string) => void;
  @Prop() defaultValue?: string;
  @Prop() helpText?: string;
  @Prop() errorText?: string;
  @Prop() disabled?: boolean;

  @Watch('defaultValue')
  handleDefaultValueChange(newValue: string) {
    this.updateInput(newValue);
  }

  @Event() formControlInput: EventEmitter<any>;
  @Event() formControlBlur: EventEmitter<any>;

  componentDidLoad() {
    this.updateInput(this.defaultValue);
  }

  handleFormControlInput = (event: any) => {
    const target = event.target;
    const name = target.getAttribute('name');
    this.inputHandler(name, target.value);
    this.formControlInput.emit(target.value);
  }

  updateInput = (newValue: any) => {
    this.selectElement.value = newValue;
  }

  private get part(): string {
    let part = 'input';
    if (this.errorText) {
      part += ' input-invalid';
    }
    if (this.isFocused) {
      part += ' input-focused';
    }
    return part;
  }

  render() {
    return (
      <Host>
        <div class="form-group d-flex flex-column">
          <FormLabel
            htmlFor={this.name}
            label={this.label}
            helpText={this.helpText}
          />
          <select
            ref={el => (this.selectElement = el as HTMLSelectElement)}
            id={this.name}
            name={this.name}
            onFocus={() => { this.isFocused = true; }}
            onBlur={() => {
              this.isFocused = false
              this.formControlBlur.emit();
            }}
            onInput={this.handleFormControlInput}
            part={this.part}
            class={this.errorText ? 'form-select is-invalid' : 'form-select'}
            disabled={this.disabled}
          >
            {this.options?.map(option => (
              <option value={option.value}>{option.label}</option>
            ))}
          </select>
          <FormControlErrorText errorText={this.errorText} name={this.name} />
        </div>
      </Host>
    );
  }
}
