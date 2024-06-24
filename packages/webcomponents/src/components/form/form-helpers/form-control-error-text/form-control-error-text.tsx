import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'form-control-error-text',
})
export class FormControlErrorText {
  @Prop() errorText: string;

  render() {

    if (!this.errorText) {
      return null;
    }

    return (
      <small class='form-text text-danger' id='formErrorText'>
        {this.errorText}
      </small>
    );
  }
}
