import {
  Component,
  Host,
  h,
  Prop,
  Event,
  EventEmitter,
  State,
  Element,
} from '@stencil/core';
import { FormControlErrorText } from './form-helpers/form-control-error-text';

@Component({
  tag: 'form-control-file-v2',
})
export class FileInput {
  @Element() el: HTMLElement;

  @State() files: File[];

  @Prop() label: string;
  @Prop() name: any;
  @Prop() helpText?: string;
  @Prop() errorText?: string;
  @Prop() multiple?: boolean;
  @Prop() inputHandler: (name: string, value: string) => void;
  @Prop() disabled: boolean;

  @Event() formControlInput: EventEmitter<any>;
  @Event() formControlBlur: EventEmitter<any>;

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
            type="file"
            name={this.name}
            part={`input ${this.errorText ? "input-invalid " : ""}${this.disabled ? "input-disabled" : ""}`}
            class={this.errorText ? "form-control is-invalid" : "form-control"}
            multiple={this.multiple}
            disabled={this.disabled}
            onBlur={() => this.formControlBlur.emit()}
            onChange={() => this.errorText = ""}
          />
          <FormControlErrorText errorText={this.errorText} name={this.name} />
        </div>
      </Host>
    );
  }
}
