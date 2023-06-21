import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'form-control-select',
  styleUrl: 'form-control-select.scss',
  shadow: true,
})
export class TextInput {
  @Prop() label: string;
  @Prop() name: any;
  @Prop() onInput: (e: Event) => void;
  @Prop() error: string;
  @Prop() options: { label: string; value: string }[];

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <label part="label" class="form-label" htmlFor={this.name}>
          {this.label}
        </label>
        <select
          id={this.name}
          name={this.name}
          onInput={this.onInput}
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