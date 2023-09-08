import { Component, Host, h, Prop, Event, EventEmitter, Element, Watch } from '@stencil/core';

@Component({
  tag: 'form-control-select',
  styleUrl: 'form-control-select.scss',
  shadow: true,
})
export class SelectInput {
  @Element() el: HTMLElement;

  @Prop() label: string;
  @Prop() name: any;
  @Prop() error: string;
  @Prop() defaultValue: string;
  @Prop() inputHandler: (name: string, value: string) => void;
  @Prop() options: { label: string; value: string }[];
  @Event() formControlInput: EventEmitter<any>;
  @Event() formControlBlur: EventEmitter<any>;

  @Watch('defaultValue')
  handleDefaultValueChange(newValue: string) {
    this.updateInput(newValue);
  }

  updateInput(newValue: any) {
    const selectElement = this.el.shadowRoot.querySelector('select');
    if (selectElement) {
      selectElement.value = newValue;
    }
  }

  handleFormControlInput(event: any) {
    const target = event.target;
    const name = target.getAttribute('name');
    this.inputHandler(name, target.value);
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
        <select
          id={this.name}
          name={this.name}
          onInput={(event: any) => this.handleFormControlInput(event)}
          onBlur={() => this.formControlBlur.emit()}
          part={`input ${this.error && 'input-invalid'}`}
          class={this.error ? 'form-select is-invalid' : 'form-select'}
        >
          {this.options.map(option => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
        {this.error && <div class="invalid-feedback">{this.error}</div>}
      </Host>
    );
  }
}
