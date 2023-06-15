import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'form-control-text',
  styleUrl: 'form-control-text.scss',
  shadow: true,
})
export class TextInput {
  @Prop() label: string;
  @Prop() name: any;
  @Prop() onInput: (e: any) => void;
  @Prop() error: string;
  @Prop() value: string;

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <label part="label" class="form-label">
          {this.label}
        </label>
        <input
          name={this.name}
          type="text"
          onInput={this.onInput}
          value={this.value}
          part={`input ${this.error && 'input-invalid'}`}
          class={this.error ? 'form-control is-invalid' : 'form-control'}
        />
        {this.error && <div class="invalid-feedback">{this.error}</div>}
      </Host>
    );
  }
}
