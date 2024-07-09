import {
  Component,
  Host,
  h,
  Prop,
  Event,
  EventEmitter,
  State,
  Watch,
} from '@stencil/core';

@Component({
  tag: 'form-control-date'
})
export class DateInput {
  dateInput!: HTMLInputElement;

  @Prop() label: string;
  @Prop() name: string;
  @Prop() helpText?: string;
  @Prop() errorText?: string;
  @Prop() defaultValue: string;
  @Prop() inputHandler: any;
  @Prop() disabled: boolean;

  @State() date: string
  
  @Event() formControlInput: EventEmitter<any>;
  @Event() formControlBlur: EventEmitter<any>;

  updateInput(value: any) {
    this.dateInput.value = value;
  }

  handleFormControlInput = (event: any) => {
    const target = event.target;
    const name = target.getAttribute('name');
    this.inputHandler(name, target.value);
    this.formControlInput.emit({ name, value: target.value });
  }

  @Watch('defaultValue')
  handleDefaultValueChange(newValue: string) {
    this.updateInput(newValue);
  }

  componentDidLoad() {
    this.updateInput(this.defaultValue);
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <label part="label" class="form-label" htmlFor={this.name}>
          {this.label}
        </label>
        <input
          type="date"
          ref={el => (this.dateInput = el as HTMLInputElement)}
          id={this.name}
          name={this.name}
          onBlur={this.formControlBlur.emit}
          onChange={this.handleFormControlInput}
          part={`input ${this.errorText && 'input-invalid'}`}
          class={this.errorText ? 'form-control is-invalid' : 'form-control'}
          disabled={this.disabled}
        />
        <form-control-help-text helpText={this.helpText} />
        <form-control-error-text errorText={this.errorText} />     
      </Host>
    );
  }
}
