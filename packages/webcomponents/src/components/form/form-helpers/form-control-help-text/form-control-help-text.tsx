import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'form-control-help-text',
})
export class FormControlHelpText {
  @Prop() helpText: string;
  @Prop() errorText: string;

  private text: string;

  get colorClass() {
    return this.errorText ? 'text-danger' : 'text-muted';
  }

  render() {

    if (!this.helpText && !this.errorText) {
      return null;
    }

    if (this.errorText) {
      this.text = this.errorText;
    } else {
      this.text = this.helpText;
    }

    return (
      <small class={`form-text ${this.colorClass}`} id='formHelpText'>
        {this.text}
      </small>
    );
  }
}
