import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'form-control-help-text',
})
export class FormControlHelpText {
  @Prop() helpText: string;
  @Prop() name: string;

  render() {

    if (!this.helpText) {
      return null;
    }

    return (
      <small class='form-text text-muted' id={`form-help-text-${this.name}`}>
        {this.helpText}
      </small>
    );
  }
}
