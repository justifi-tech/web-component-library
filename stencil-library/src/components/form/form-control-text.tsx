import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'form-control-text',
  styleUrl: 'form-control-text.scss',
  shadow: true,
})
export class TextInput {
  @Prop() label: string;
  @Prop() name: any;
  @Prop() error: string;
  @Prop() defaultValue: string;
  @Event() formControlInput: EventEmitter<any>;
  @Event() formControlBlur: EventEmitter<any>;

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <label part="label" class="form-label" htmlFor={this.name}>
          {this.label}
        </label>
        <input
          id={this.name}
          name={this.name}
          onInput={(event: any) => this.formControlInput.emit({ name: this.name, value: event.target.value })}
          onBlur={() => this.formControlBlur.emit()}
          part={`input ${this.error && 'input-invalid'}`}
          class={this.error ? 'form-control is-invalid' : 'form-control'}
          type="text"
        />
        {this.error && <div class="invalid-feedback">{this.error}</div>}
      </Host>
    );
  }
}