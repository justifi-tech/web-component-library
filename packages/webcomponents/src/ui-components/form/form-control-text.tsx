import {
  Component,
  Host,
  h,
  Prop,
  Event,
  EventEmitter,
  Element,
  Watch,
  State,
} from '@stencil/core';
import { FormControlErrorText } from '../../ui-components';

@Component({
  tag: 'form-control-text'
})
export class TextInput {
  @Element() el: HTMLElement;

  @State() isFocused: boolean = false;

  @Prop() name: any;
  @Prop() label: string;
  @Prop() inputHandler: (name: string, value: string) => void;
  @Prop() defaultValue?: string;
  @Prop() helpText?: string;
  @Prop() errorText?: string;
  @Prop() maxLength?: number;
  @Prop() keyDownHandler?: (event: any) => void;
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
    this.formControlInput.emit({ name, value: target.value });
  }

  updateInput = (newValue: any) => {
    const inputElement = this.el.querySelector('input');
    if (inputElement) {
      inputElement.value = newValue || '';
    }
  }

  private get part(): string {
    let part = 'input';
    if (this.errorText) {
      part += ' input-invalid';
    }
    if (this.disabled) {
      part += ' input-disabled';
    }
    if (this.isFocused) {
      part += ' input-focused';
    }
    return part;
  };

  render() {
    return (
      <Host>
        <div class="form-group d-flex flex-column">
          <div class="d-flex align-items-center gap-2">
            <label
              part="label"
              class="form-label d-flex gap-2 align-items-center"
              htmlFor={this.name}
            >
              {this.label}
              <form-control-tooltip helpText={this.helpText} />
            </label>

          </div>
          <input
            id={this.name}
            name={this.name}
            onFocus={() => { this.isFocused = true; }}
            onBlur={() => {
              this.isFocused = false;
              this.formControlBlur.emit();
            }}
            onInput={this.handleFormControlInput}
            onKeyDown={this.keyDownHandler}
            onPaste={this.keyDownHandler}
            maxLength={this.maxLength}
            part={this.part}
            class={this.errorText ? "form-control is-invalid" : "form-control"}
            type="text"
            disabled={this.disabled}
          />
          <FormControlErrorText errorText={this.errorText} name={this.name} />
        </div>
      </Host>
    );
  }
}
