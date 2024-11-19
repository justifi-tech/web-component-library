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
    this.inputHandler(name, target.checked);
    this.formControlInput.emit({ name, value: target.value });
  }

  updateInput = (checked: boolean) => {
    this.radioElement.checked = checked;
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <div class='form-group d-flex flex-column'>
          <div class="form-check">
            <input
              ref={el => (this.radioElement = el as HTMLInputElement)}
              type="radio"
              id={this.name}
              name={this.name}
              onBlur={this.formControlBlur.emit}
              onInput={this.handleFormControlInput}
              part={`input-radio ${this.errorText ? 'input-radio-invalid' : ''}`}
              class={this.errorText ? 'form-check-input is-invalid' : 'form-check-input'}
              disabled={this.disabled}
              value={this.value}
            />
            <label class="form-check-label" htmlFor={this.name}>
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
