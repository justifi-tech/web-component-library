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
   
  updateInput(value: any) {
    this.dateInput.value = value;
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
          onInput={this.handleFormControlInput}
          part={`input ${this.errorText && 'input-invalid'}`}
          class={this.errorText ? 'form-control is-invalid' : 'form-control'}
          disabled={this.disabled}
        />
        <form-control-help-text helpText={this.helpText} name={this.name} />
        <form-control-error-text errorText={this.errorText} name={this.name} />     
      </Host>
    );
  }
}
