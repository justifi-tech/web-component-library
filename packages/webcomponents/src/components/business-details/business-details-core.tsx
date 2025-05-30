import { Component, Event, EventEmitter, Prop, State, h } from '@stencil/core';
import { Business } from '../../api/Business';
import { ErrorState } from '../../ui-components/details/utils';
import { ComponentErrorEvent } from '../../api/ComponentEvents';
import { StyledHost } from '../../ui-components';
import { BusinessDetailsLoading } from './business-details-loading';

enum RENDER_STATES {
  LOADING = 'loading',
  READY = 'ready',
  ERROR = 'error',
}

@Component({
  tag: 'business-details-core'
})
export class BusinessDetailsCore {
  @Prop() getBusiness: Function;

  @State() business: Business;
  @State() renderState: RENDER_STATES = RENDER_STATES.LOADING;
  @State() errorMessage: string;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;

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
      onError: ({ error, code, severity }) => {
        this.errorMessage = error;
        this.renderState = RENDER_STATES.ERROR;

        this.errorEvent.emit({
          errorCode: code,
          message: error,
          severity,
        });
      }
    });
  }

  render() {
    if (this.renderState === RENDER_STATES.LOADING) {
      return (
        <StyledHost>
          <BusinessDetailsLoading />
        </StyledHost>
      );
    }

    if (this.renderState === RENDER_STATES.ERROR) {
      return <StyledHost>{ErrorState(this.errorMessage)}</StyledHost>;
    }

    return (
      <StyledHost>
        <justifi-details error-message={this.errorMessage}>
          <div slot='detail-sections'>
            <core-info-details business={this.business} />
            <legal-address-details legalAddress={this.business.legal_address} />
            <representative-details representative={this.business.representative} />
            <owner-details owners={this.business.owners} />
            <additional-questions-details
              additionalQuestions={this.business.additional_questions}
            />
          </div>
        </justifi-details>
      </StyledHost>
    );
  }
}
