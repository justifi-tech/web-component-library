import { Component, Host, h, Event, Prop, State, EventEmitter } from '@stencil/core';

@Component({
  tag: 'text-input',
  styleUrl: 'text-input.scss',
  shadow: true,
})
export class TextInput {
  @Prop() name: string;
  @Prop() label: string;
  @Prop() defaultValue: string;
  @Prop() error: string;
  @Event() fieldReceivedInput: EventEmitter<{ name: string, value: string }>;
  @State() internalValue = '';

  onInput(event) {
    const target = event.target;
    const name = target.getAttribute('name');
    this.fieldReceivedInput.emit({ name: name, value: target.value });
  };

  render() {
    return (
      <Host exportparts="label,input">
        <label part="label" class="form-label">{this.label}</label>
        <input
          part="input"
          name={this.name}
          type="text"
          class={this.error ? 'form-control is-invalid' : 'form-control'}
          onInput={(event) => this.onInput(event)}
          value={this.internalValue || this.defaultValue}
        />
        {this.error && <div class="invalid-feedback">{this.error}</div>}
      </Host>
    );
  }

}
