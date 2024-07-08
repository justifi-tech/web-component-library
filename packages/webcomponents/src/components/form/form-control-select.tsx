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
  tag: 'form-control-select'
})
export class SelectInput {
  selectElement!: HTMLSelectElement;

  @Prop() label: string;
  @Prop() name: any;
  @Prop() helpText?: string;
  @Prop() errorText?: string;
  @Prop() defaultValue: string;
  @Prop() inputHandler: (name: string, value: string) => void;
  @Prop() options: { label: string; value: string }[];
  @Prop() disabled: boolean;

  @Event() formControlInput: EventEmitter<any>;
  @Event() formControlBlur: EventEmitter<any>;

  @Watch('defaultValue')
  handleDefaultValueChange(newValue: string) {
    this.updateInput(newValue);
  }

  updateInput(newValue: any) {
    this.selectElement.value = newValue;
  }

  handleFormControlInput(event: any) {
    const target = event.target;
    const name = target.getAttribute('name');
    this.inputHandler(name, target.value);
    this.formControlInput.emit(target.value);
  }

  componentDidLoad() {
    this.updateInput(this.defaultValue);
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <div class="form-group d-flex flex-column">
          <label part="label" class="form-label" htmlFor={this.name}>
            {this.label}
          </label>
          <select
            ref={el => (this.selectElement = el as HTMLSelectElement)}
            id={this.name}
            name={this.name}
            onInput={(event: any) => this.handleFormControlInput(event)}
            onBlur={() => this.formControlBlur.emit()}
            part={`input ${this.errorText ? 'input-invalid' : ''}`}
            class={this.errorText ? 'form-select is-invalid' : 'form-select'}
            disabled={this.disabled}
          >
            {this.options?.map(option => (
              <option value={option.value}>{option.label}</option>
            ))}
          </select>
          <form-control-help-text helpText={this.helpText} />
          <form-control-error-text errorText={this.errorText} />
        </div>
      </Host>
    );
  }
}
