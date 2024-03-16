import { Component, Host, Prop, State, h } from '@stencil/core';
import { Business } from '../../api/Business';
import { ErrorState, LoadingState } from '../details/utils';

enum RENDER_STATES {
  LOADING = 'loading',
  READY = 'ready',
  ERROR = 'error',
}

@Component({
  tag: 'business-details-core',
  styleUrl: 'business-details.scss',
})
export class BusinessDetailsCore {
  @Prop() getBusiness: Function;
  @State() business: Business;
  @State() renderState: RENDER_STATES = RENDER_STATES.LOADING;
  @State() errorMessage: string = 'An error ocurred.';

  async componentWillLoad() {
    if (this.getBusiness) {
      this.fetchData();
    }
  }

  fetchData() {
    this.renderState = RENDER_STATES.LOADING;

    this.getBusiness({
      onSuccess: ({ business }) => {
        this.business = business;
        this.renderState = RENDER_STATES.READY;
      },
      onError: ({ error }) => {
        console.error(error);
        this.errorMessage = error;
        this.renderState = RENDER_STATES.ERROR;
      }
    });
  }

  render() {
    if (this.renderState === RENDER_STATES.LOADING) {
      return <Host>{LoadingState()}</Host>;
    }

    if (this.renderState === RENDER_STATES.ERROR) {
      return <Host>{ErrorState(this.errorMessage)}</Host>;
    }

    return (
      <Host>
        <generic-info-details business={this.business} />
        <legal-address-details legalAddress={this.business.legal_address} />
        <representative-details representative={this.business.representative} />
        <owners-details owners={this.business.owners} />
        <additional-questions-details
          additionalQuestions={this.business.additional_questions}
        />
      </Host>
    );
  }
}
