import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'form-control-text',
  styleUrl: 'form-control-text.scss',
  shadow: true,
})
export class TextInput {
  @Prop() label: string;
  @Prop() name: any;
  @Prop() onInput: (e: Event) => void;
  @Prop() error: string;
  @Prop() value: string;

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <label part="label" class="form-label" htmlFor={this.name}>
          {this.label}
        </label>
        <input
          id={this.name}
          name={this.name}
          onInput={this.onInput}
          value={this.value}
          part={`input ${this.error && 'input-invalid'}`}
          class={this.error ? 'form-control is-invalid' : 'form-control'}
          type="text"
        />
        {this.error && <div class="invalid-feedback">{this.error}</div>}
      </Host>
    );
  }
}
