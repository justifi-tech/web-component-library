import { Component, Host, h, Prop, Listen, State } from '@stencil/core';
import { Api } from '../../api';
import BusinessFormSchema, { BusinessStructureOptions, BusinessTypeOptions } from './business-form-schema';
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

  @Listen('formShouldUpdate')
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
          <div class="row gy-3">
            <div class="col-12">
              <form-control-text
                name="legal_name"
                label="Legal Name"
                defaultValue={this.form.defaultValues?.legal_name}
                error={this.form.errors?.legal_name}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="doing_business_as"
                label="Doing Business As (DBA)"
                defaultValue={this.form.defaultValues?.doing_business_as}
                error={this.form.errors?.doing_business_as}
              />
            </div>
            <div class="col-12">
              <form-control-select
                name="business_type"
                label="Business Type"
                options={BusinessTypeOptions}
                defaultValue={this.form.defaultValues?.business_type}
                error={this.form.errors?.business_type} />
            </div>
            <div class="col-12">
              <form-control-select
                name="business_structure"
                label="Business Structure"
                options={BusinessStructureOptions}
                defaultValue={this.form.defaultValues?.business_structure}
                error={this.form.errors?.business_structure} />
            </div>
            <div class="col-12">
              <form-control-text
                name="industry"
                label="Industry"
                defaultValue={this.form.defaultValues.industry}
                error={this.form.errors?.business_structure} />
            </div>
            <div class="col-12">
              <form-control-text
                name="website_url"
                label="Website URL"
                defaultValue={this.form.defaultValues?.website_url}
                error={this.form.errors?.website_url} />
            </div>
            <div class="col-12">
              <form-control-text
                name="email"
                label="Email Address"
                defaultValue={this.form.defaultValues?.email}
                error={this.form.errors?.email} />
            </div>
            <div class="col-12">
              <form-control-text
                name="phone"
                label="Phone"
                defaultValue={this.form.defaultValues?.phone}
                error={this.form.errors?.phone} />
            </div>
          </div>
        </form-component>
      </Host>
    );
  }

}
