import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'form-control-error-text',
})
export class FormControlErrorText {
  @Prop() errorText: string;
  @Prop() name: string;

  render() {

    if (!this.errorText) {
      return null;
    }

    return (
      <small class='form-text text-danger' id={`form-error-text-${this.name}`}>
        {this.errorText}
      </small>
    );
  }
}
