import { Component, h, Prop, Watch, State } from '@stencil/core';
import { PayoutService } from '../../api/services/payout.service';
import { makeGetPayout } from './get-payout';
import { ErrorState } from '../details/utils';

@Component({
  tag: 'justifi-payout-details',
  shadow: true,
})

export class PayoutDetails {
  @Prop() payoutId: string;
  @Prop() authToken: string;
  @State() getPayout: Function;
  @State() errorMessage: string = null;

  componentWillLoad() {
    this.initializeGetPayout();
  }

  @Watch('payoutId')
  @Watch('authToken')
  propChanged() {
    this.initializeGetPayout();
  }

  initializeGetPayout() {
    if (this.payoutId && this.authToken) {
      this.getPayout = makeGetPayout({
        id: this.payoutId,
        authToken: this.authToken,
        service: new PayoutService()
      });
    } else {
      this.errorMessage = 'Failed to load payout details. payoutId or authToken is not provided.';
    }
  }

  render() {
    if (this.errorMessage) {
      return ErrorState(this.errorMessage);
    }

    return (
      <payout-details-core getPayout={this.getPayout}></payout-details-core>
    );
  }
}
