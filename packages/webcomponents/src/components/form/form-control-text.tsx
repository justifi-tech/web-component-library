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
import { ToolTip } from '../../ui-components/tooltip';

@Component({
  tag: 'form-control-text'
})
export class TextInput {
  @Element() el: HTMLElement;

  @Prop() label: string;
  @Prop() name: any;
  @Prop() helpText?: string;
  @Prop() errorText?: string;
  @Prop() defaultValue: string;
  @Prop() maxLength?: number;
  @Prop() inputHandler: (name: string, value: string) => void;
  @Prop() keyDownHandler?: (event: any) => void;
  @Prop() disabled: boolean;

  @Watch('defaultValue')
  handleDefaultValueChange(newValue: string) {
    this.updateInput(newValue);
  }

  @Event() formControlInput: EventEmitter<any>;
  @Event() formControlBlur: EventEmitter<any>;

  componentDidLoad() {
    this.updateInput(this.defaultValue);
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = Array.from(tooltipTriggerList).map(tooltipTriggerEl => new (window as any).bootstrap.Tooltip(tooltipTriggerEl));
    console.log('tooltipList', tooltipList);
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
          <label part="label" class="form-label" htmlFor={this.name}>
            {this.label}
          </label>
          <div class="input-group">
            <input
                id={this.name}
                name={this.name}
                onBlur={this.formControlBlur.emit}
                onInput={this.handleFormControlInput}
                onKeyDown={this.keyDownHandler}
                onPaste={this.keyDownHandler}
                maxLength={this.maxLength}
                part={`input ${this.errorText ? 'input-invalid ' : ''}${this.disabled ? ' input-disabled' : ''}`}
                class={this.errorText ? 'form-control is-invalid' : 'form-control'}
                type="text"
                disabled={this.disabled}
              />
              <span class="input-group-text" part="input-group-text">
                <ToolTip text='This is a tooltip' />
              </span>
          </div>
          <form-control-help-text helpText={this.helpText} name={this.name} />
          <form-control-error-text errorText={this.errorText} name={this.name} />
        </div>
      </Host>
    );
  }
}
