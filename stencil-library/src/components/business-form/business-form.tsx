import { Component, Host, h, Prop, State, Listen } from '@stencil/core';
import { Api } from '../../api';
import BusinessFormSchema, { Business, BusinessStructureOptions, BusinessTypeOptions } from './business-form-schema';
import form from '../form/form-store';

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
  @State() business = new Business();
  @State() businessFormFieldsErrors: any = {};

  private endpoint: string = 'entities/business';

  componentDidMount() {
    if (this.businessId) {
      this.fetchBusiness();
    }
  }

  async fetchBusiness(): Promise<void> {
    // fetch data and pre-fill form
    const businessPrefillData = await Api(this.authToken).get(`${this.endpoint}/${this.businessId}`);
    this.business = businessPrefillData;
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
        {JSON.stringify(form.values)}
        <form-component form={form} schema={BusinessFormSchema}>
          <div class="row gy-3">
            <div class="col-12">
              <form-control-text
                name="legal_name"
                label="Legal Name"
                defaultValue={form.defaultValues?.legal_name}
                error={form.errors?.legal_name}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="doing_business_as"
                label="Doing Business As (DBA)"
                defaultValue={form.defaultValues?.doing_business_as}
                error={form.errors?.doing_business_as}
              />
            </div>
            <div class="col-12">
              <form-control-select
                name="business_type"
                label="Business Type"
                options={BusinessTypeOptions}
                defaultValue={form.defaultValues?.business_type}
                error={form.errors?.business_type} />
            </div>
            <div class="col-12">
              <form-control-select
                name="business_structure"
                label="Business Structure"
                options={BusinessStructureOptions}
                defaultValue={form.defaultValues?.business_structure}
                error={form.errors?.business_structure} />
            </div>
            <div class="col-12">
              <form-control-text
                name="industry"
                label="Industry"
                defaultValue={form.defaultValues.industry}
                error={form.errors?.business_structure} />
            </div>
            <div class="col-12">
              <form-control-text
                name="website_url"
                label="Website URL"
                defaultValue={form.defaultValues?.website_url}
                error={form.errors?.website_url} />
            </div>
            <div class="col-12">
              <form-control-text
                name="email"
                label="Email Address"
                defaultValue={form.defaultValues?.email}
                error={form.errors?.email} />
            </div>
            <div class="col-12">
              <form-control-text
                name="phone"
                label="Phone"
                defaultValue={form.defaultValues?.phone}
                error={form.errors?.phone} />
            </div>
          </div>
        </form-component>
      </Host>
    );
  }

}
