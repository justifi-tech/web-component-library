import {
  Component,
  Host,
  h,
  Prop,
  Event,
  EventEmitter,
  Watch,
} from '@stencil/core';

@Component({
  tag: 'form-control-radio'
})
export class RadioInput {
  radioElement!: HTMLInputElement;

  @Prop() label: string;
  @Prop() name: any;
  @Prop() value: string;
  @Prop() helpText?: string;
  @Prop() hasError?: boolean;
  @Prop() defaultValue?: string;
  @Prop() inputHandler: (name: string, value: string) => void;
  @Prop() disabled: boolean;

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

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <div class='form-group d-flex flex-column'>
          <div class="form-check">
            <input
              ref={el => (this.radioElement = el as HTMLInputElement)}
              type="radio"
              id={`${this.name}-${this.value}`}
              name={this.name}
              onBlur={this.formControlBlur.emit}
              onInput={this.handleFormControlInput}
              part={`input-radio ${this.hasError ? 'input-radio-invalid' : ''}`}
              class={this.hasError ? 'form-check-input is-invalid' : 'form-check-input'}
              disabled={this.disabled}
              value={this.value}
            />
            <label class="form-check-label" htmlFor={`${this.name}-${this.value}`}>
              {this.label}
            </label>
          </div>
        </div>
      </Host>
    );
  }
}
