import { Component, Host, h, Prop, Listen, State } from '@stencil/core';
import { Api } from '../../api';
import BusinessFormSchema from './business-form-schema';
import FormState from '../form/form';

/**
 * @exportedPart label: Label for inputs
 * @exportedPart input: The input fields
 * @exportedPart input-invalid: Invalid state for inputfs
 */
@Component({
  tag: 'justifi-business-form',
  styleUrl: 'business-form.scss',
  shadow: true,
})
export class BusinessForm {
  @Prop() authToken: string;
  @Prop() businessId?: string;
  @State() form: FormState = new FormState({}, BusinessFormSchema);

  @Listen('updateFormState')
  handleFormShouldUpdate(event: CustomEvent) {
    this.form = { ...event.detail };
  };

  private endpoint: string = 'entities/business';

  componentDidMount() {
    if (this.businessId) {
      this.fetchBusiness();
    }
  }

  async fetchBusiness(): Promise<void> {
    // fetch data and pre-fill form
    const businessPrefillData = await Api(this.authToken).get(`${this.endpoint}/${this.businessId}`);
    this.form = { ...this.form, defaultValues: businessPrefillData }
  };

  async sendBusinessForm(data): Promise<void> {
    console.log('sendBusinessForm', data);
    // return Api(this.authToken).post(this.endpoint, data);
  };

  @Listen('validFormSubmitted')
  async handleValidFormSubmitted(event: CustomEvent) {
    const data = event.detail;
    await this.sendBusinessForm(data);
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <h1>Business Information</h1>
        <form-component form={this.form}>
          <justifi-business-generic-info-form
            errors={this.form.errors}
            defaultValues={this.form.defaultValues}>
          </justifi-business-generic-info-form>
          <justifi-business-representative
            errors={this.form.errors}
            defaultValues={this.form.defaultValues}>
          </justifi-business-representative>
        </form-component>
      </Host>
    );
  }

}
