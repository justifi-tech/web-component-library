import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'form-control-help-text',
})
export class FormControlHelpText {
  @Prop() helpText: string;

  render() {

    if (!this.helpText) {
      return null;
    }

    return (
      <small class='form-text text-muted' id='formHelpText'>
        {this.helpText}
      </small>
    );
  }
}
