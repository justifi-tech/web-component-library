import { Component, h, Prop, Method, Event, EventEmitter, Watch } from '@stencil/core';
import { ComponentErrorEvent, ComponentErrorCodes, ComponentErrorSeverity } from '../../../../api';
import { CountryCode } from '../../../../utils/country-codes';
import { heading2 } from '../../../../styles/parts';

@Component({
  tag: 'document-upload-form-step'
})
export class DocumentUploadFormStep {
  @Prop() authToken!: string;
  @Prop() businessId!: string;
  @Prop() allowOptionalFields?: boolean;
  @Prop() country!: CountryCode;

  @Watch('authToken')
  @Watch('businessId')
  propChanged() {
    this.initializeApi();
  }

  @Event({ eventName: 'error-event', bubbles: true }) errorEvent: EventEmitter<ComponentErrorEvent>;
  @Event() formLoading: EventEmitter<boolean>;

  @Method()
  async validateAndSubmit({ onSuccess }) {
    onSuccess();
  }

  componentWillLoad() {
    this.initializeApi();
  }

  private initializeApi() {
    if (!this.authToken || !this.businessId) {
      this.errorEvent.emit({
        message: 'Missing required props',
        errorCode: ComponentErrorCodes.MISSING_PROPS,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  }

  render() {
    return (
      <form>
        <fieldset>
          <legend class="mb-0" part={heading2}>Document Uploads</legend>
          <hr class="mt-2" />
        </fieldset>
      </form>
    );
  }
}
