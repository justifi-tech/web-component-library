import { Component, h, Prop } from '@stencil/core';
import { text } from '../../../../styles/parts';

@Component({
  tag: 'bank-account-read-only-value'
})
export class BankAccountReadOnlyValue {
  @Prop() label!: string;
  @Prop() value?: string;

  render() {
    return (
      <div>
        <label class="form-label" part={text}>{this.label}</label>
        <div part={text}>{this.value || ''}</div>
      </div>
    );
  }
}


