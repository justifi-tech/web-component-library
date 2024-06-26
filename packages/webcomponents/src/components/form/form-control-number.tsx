import {
  Component,
  Host,
  h,
  Prop,
  Event,
  EventEmitter,
  State,
  Element,
  Watch,
} from '@stencil/core';

@Component({
  tag: 'form-control-number',
  styleUrl: 'form-control-number.scss',
  shadow: true,
})
export class NumberInput {
  @Element() el: HTMLElement;

  @Prop() label: string;
  @Prop() name: any;
  @Prop() error: string;
  @Prop() defaultValue: string;
  @Prop() inputHandler: (name: string, value: string) => void;
  @Prop() disabled: boolean;
  @State() input: string;
  @Event() formControlInput: EventEmitter<any>;
  @Event() formControlBlur: EventEmitter<any>;

  @Watch('defaultValue')
  handleDefaultValueChange(newValue: string) {
    this.updateInput(newValue);
  }

  updateInput(newValue: any) {
    const inputElement = this.el.shadowRoot.querySelector('input');
    if (inputElement) {
      inputElement.value = newValue || '';
    }
  }

  handleFormControlInput(event: any) {
    const target = event.target;
    const name = target.getAttribute('name');
    this.inputHandler(name, target.value);
    this.formControlInput.emit({ name, value: target.value });
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
        <input
          id={this.name}
          name={this.name}
          onInput={(event: any) => this.handleFormControlInput(event)}
          onBlur={() => this.formControlBlur.emit()}
          part={`input ${this.error && 'input-invalid'}`}
          class={this.error ? 'form-control is-invalid' : 'form-control'}
          type="number"
          disabled={this.disabled}
        />
        {this.error && <div class="invalid-feedback">{this.error}</div>}
      </Host>
    );
  }
}
