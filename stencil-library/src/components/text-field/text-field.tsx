import { Component, Host, h, Event, Prop, State, EventEmitter } from '@stencil/core';

@Component({
  tag: 'text-field',
  styleUrl: 'text-field.css',
  shadow: true,
})
export class TextField {
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
      <Host>
        <label>{this.label}</label>
        <input
          name={this.name}
          type="text"
          onInput={(event) => this.onInput(event)}
          value={this.internalValue || this.defaultValue}
        />
        {this.error && <div style={{ color: 'red' }}>{this.error}</div>}
      </Host>
    );
  }

}
