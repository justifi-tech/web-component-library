import { Component, Event, Host, Prop, h, EventEmitter, State } from '@stencil/core';

@Component({
  tag: 'select-input',
  styleUrl: 'select-input.scss',
  shadow: true,
})
export class SelectInput {
  @Prop() name: string;
  @Prop() label: string;
  @Prop() defaultValue: string;
  @Prop() error: string;
  @Prop() options: { label: string; value: string }[] = [];
  @Event() fieldReceivedInput: EventEmitter<{ name: string; value: string }>;
  @State() internalValue = '';

  onInput(event) {
    const target = event.target;
    const name = target.getAttribute('name');
    this.fieldReceivedInput.emit({ name: name, value: target.value });
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid,invalid-feedback">
        <label part="label" class="form-label">
          {this.label}
        </label>
        <select
          name={this.name}
          onInput={event => this.onInput(event)}
          part={`input${this.error ? ' input-invalid' : ''}`}
          class={this.error ? 'form-select is-invalid' : 'form-select'}
        >
          {this.options.map(option => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
        {this.error && <div class="invalid-feedback" part="invalid-feedback">{this.error}</div>}
      </Host>
    );
  }
}
