import { Component, h, Prop } from '@stencil/core';
import { ErrorState } from './utils';

@Component({
  tag: 'justifi-details',
})

export class Details {
  @Prop() errorMessage: string;

  render() {
    return (
      <div>
        {
          this.errorMessage ?
            ErrorState(this.errorMessage)
            :
            <main class="p-2">
              <slot name="head-info" />
              <slot name='detail-sections' />
            </main>
        }
      </div>
    )
  }
}
