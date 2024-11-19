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
  tag: 'form-control-checkbox'
})
export class CheckboxInput {
  checkboxElement!: HTMLInputElement;

  @Prop() label: string;
  @Prop() name: any;
  @Prop() helpText?: string;
  @Prop() errorText?: string;
  @Prop() defaultValue?: boolean;
  @Prop() inputHandler: (name: string, value: boolean) => void;
  @Prop() disabled: boolean;
  
  @Watch('defaultValue')
  handleDefaultValueChange(newValue: boolean) {
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
    this.inputHandler(name, target.checked);
    this.formControlInput.emit({ name, value: target.value });
  }

  updateInput = (newValue: any) => {
    this.checkboxElement.checked = newValue;
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <div class='form-group d-flex flex-column'>
          <div class="form-check">
            <input
              ref={el => (this.checkboxElement = el as HTMLInputElement)}
              type="checkbox"
              id={this.name}
              name={this.name}
              onBlur={this.formControlBlur.emit}
              onInput={this.handleFormControlInput}
              part={`input-checkbox ${this.errorText ? 'input-checkbox-invalid' : ''}`}
              class={this.errorText ? 'form-check-input is-invalid' : 'form-check-input'}
              disabled={this.disabled}
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
