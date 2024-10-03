import { Component, h } from '@stencil/core';

@Component({
  tag: 'justifi-dispute-management',
  shadow: true,
})
export class DisputeManagement {

  render() {
    return (
      <justifi-dispute-management-core></justifi-dispute-management-core>
    );
  }
}
