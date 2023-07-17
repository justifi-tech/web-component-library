import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'form-control-select',
  styleUrl: 'form-control-select.scss',
  shadow: true,
})
export class TextInput {
  @Prop() label: string;
  @Prop() name: any;
  @Prop() error: string;
  @Prop() defaultValue: string;
  @Prop() onChange: (field: { [key: string]: string }) => void;
  @Prop() options: { label: string; value: string }[];
  @Event() formControlInput: EventEmitter<any>;
  @Event() formControlBlur: EventEmitter<any>;

  handleFormControlInput(event: any) {
    const target = event.target;
    const name = target.getAttribute('name');
    this.onChange({ [name]: target.value });
  };

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <label part="label" class="form-label" htmlFor={this.name}>
          {this.label}
        </label>
        <select
          id={this.name}
          name={this.name}
          onInput={(event: any) => this.handleFormControlInput(event)}
          part={`input ${this.error && 'input-invalid'}`}
          class={this.error ? 'form-select is-invalid' : 'form-select'}>
          {this.options.map(option => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
        {this.error && <div class="invalid-feedback">{this.error}</div>}
      </Host>
    );
  }
}