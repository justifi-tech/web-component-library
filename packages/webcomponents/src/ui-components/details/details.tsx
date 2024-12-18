import { Component, h, Host, Prop } from '@stencil/core';
import { ErrorState } from './utils';

@Component({
  tag: 'justifi-details',
})

export class Details {
  @Prop() errorMessage: string;

  render() {
    return (
      <Host>
        {
          this.errorMessage ?
            ErrorState(this.errorMessage)
            :
            <main class="p-2">
              <slot name="head-info" />
              <slot name='detail-sections' />
            </main>
        }
      </Host>
    )
  }
}
