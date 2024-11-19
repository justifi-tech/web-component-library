import {
  Component,
  Host,
  h,
  Prop,
  Event,
  EventEmitter,
  Element,
  Watch,
} from '@stencil/core';

@Component({
  tag: 'form-control-text'
})
export class TextInput {
  @Element() el: HTMLElement;

  @Prop() name: any;
  @Prop() label: string;
  @Prop() inputHandler: (name: string, value: string) => void;
  @Prop() defaultValue?: string;
  @Prop() helpText?: string;
  @Prop() errorText?: string;
  @Prop() maxLength?: number;
  @Prop() keyDownHandler?: (event: any) => void;
  @Prop() disabled?: boolean;

  @Watch('defaultValue')
  handleDefaultValueChange(newValue: string) {
    this.updateInput(newValue);
  }

  @Event() formControlInput: EventEmitter<any>;
  @Event() formControlBlur: EventEmitter<any>;

  componentDidLoad() {
    this.updateInput(this.defaultValue);
  }

  handleFormControlInput = (event: any) => {
    const target = event.target;
    const name = target.getAttribute('name');
    this.inputHandler(name, target.value);
    this.formControlInput.emit({ name, value: target.value });
  }

  updateInput = (newValue: any) => {
    const inputElement = this.el.querySelector('input');
    if (inputElement) {
      inputElement.value = newValue || '';
    }
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <div class="form-group d-flex flex-column">
          <div class="d-flex align-items-start gap-2">
            <label part="label" class="form-label" htmlFor={this.name}>
              {this.label}
            </label>
            <form-control-tooltip helpText={this.helpText} />
          </div>
          <input
            id={this.name}
            name={this.name}
            onBlur={this.formControlBlur.emit}
            onInput={this.handleFormControlInput}
            onKeyDown={this.keyDownHandler}
            onPaste={this.keyDownHandler}
            maxLength={this.maxLength}
            part={`input ${this.errorText ? "input-invalid " : ""}${this.disabled ? " input-disabled" : ""}`}
            class={this.errorText ? "form-control is-invalid" : "form-control"}
            type="text"
            disabled={this.disabled}
          />
          <form-control-error-text errorText={this.errorText} name={this.name} />
        </div>
      </Host>
    );
  }
}
