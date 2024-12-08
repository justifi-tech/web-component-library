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

@Component({
  tag: 'form-control-radio'
})
export class RadioInput {
  radioElement!: HTMLInputElement;

  @State() isFocused: boolean = false;

  @Prop() label: string | (() => HTMLElement | JSX.Element);
  @Prop() name: any;
  @Prop() value: any;
  @Prop() helpText?: string;
  @Prop() errorText?: string;
  @Prop() defaultChecked?: boolean;
  @Prop() inputHandler: (name: string, value: boolean) => void;
  @Prop() disabled: boolean;

  @Watch('defaultChecked')
  handleDefaultValueChange(checked: boolean) {
    this.updateInput(checked);
  }

  @Event() formControlInput: EventEmitter<any>;
  @Event() formControlBlur: EventEmitter<any>;

  componentDidLoad() {
    this.updateInput(this.defaultChecked);
  }

  handleFormControlInput = (event: any) => {
    const target = event.target;
    const name = target.getAttribute('name');
    this.radioElement.checked = true;
    this.inputHandler(name, this.value);
    this.formControlInput.emit({ name, value: target.value === 'true' ? true : false });
  }

  updateInput = (checked: boolean) => {
    this.isFocused = checked;
    this.radioElement.checked = checked;
  }

  private get part(): string {
    let part = 'radio-input';
    if (this.errorText) {
      part += ' radio-input-invalid';
    }
    if (this.radioElement?.checked) {
      part += ' radio-input-checked';
    }
    if (this.isFocused) {
      part += ' radio-input-focused';
    }
    return part;
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
              onFocus={() => { this.isFocused = true; }}
              onBlur={() => {
                this.isFocused = false;
                this.formControlBlur.emit()
              }}
              onInput={this.handleFormControlInput}
              part={this.part}
              class={this.errorText ? 'form-check-input is-invalid' : 'form-check-input'}
              disabled={this.disabled}
              value={this.value}
            />
            <label class="radio-input-label" htmlFor={this.name} part="label">
              {typeof this.label === 'function' ? this.label() : this.label}
            </label>
          </div>
          <form-control-help-text helpText={this.helpText} name={this.name} />
          <form-control-error-text errorText={this.errorText} name={this.name} />
        </div>
      </Host>
    );
  }
}
