import { Component, Host, h, Prop, State, Listen, Method } from '@stencil/core';
import { Api } from '../../api';
import BusinessFormSchema, { Business, BusinessStructureOptions, BusinessTypeOptions } from './business-form-schema';
import FormController from '../form/form-controller';


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
  @State() form = new FormController({ representative: { name: 'jake' } }, BusinessFormSchema);

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
    return Api(this.authToken).post(this.endpoint, data);
  };

  @Listen('fieldReceivedInput')
  setFormValue(event) {
    const data = event.detail;
    const businessClone = { ...this.business };
    if (data.name) {
      businessClone[data.name] = data.value;
      this.business = businessClone;
    }
  }

  @Method()
  async submit(event) {
    event.preventDefault();
    const validatedForm = await this.form.validate();
    console.log(validatedForm)
    this.businessFormFieldsErrors = validatedForm.errors;

    if (!validatedForm.isValid) return;

    const response = await this.sendBusinessForm(this.business);
    return response;
  };

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <h1>Business Information</h1>
        <form onSubmit={(event) => this.submit(event)}>
          <div class="row gy-3">
            <div class="col-12">
              <form-control-text
                name="legal_name"
                label="Legal Name"
                {...this.form.register('legal_name')}
                error={this.form.errors?.legal_name} />
            </div>
            <div class="col-12">
              <form-control-text
                name="doing_business_as"
                label="Doing Business As (DBA)"
                {...this.form.register('doing_business_as')}
                error={this.form.errors?.doing_business_as} />
            </div>
            <div class="col-12">
              <form-control-select
                name="business_type"
                label="Business Type"
                options={BusinessTypeOptions}
                {...this.form.register('business_type')}
                error={this.form.errors?.business_type} />
            </div>
            <div class="col-12">
              <form-control-select
                name="business_structure"
                label="Business Structure"
                options={BusinessStructureOptions}
                {...this.form.register('business_structure')}
                error={this.form.errors?.business_structure} />
            </div>
            <div class="col-12">
              <form-control-text
                name="industry"
                label="Industry"
                {...this.form.register('industry')}
                error={this.form.errors?.industry} />
            </div>
            <div class="col-12">
              <form-control-text
                name="website_url"
                label="Website URL"
                {...this.form.register('website_url')}
                error={this.form.errors?.website_url} />
            </div>
            <div class="col-12">
              <form-control-text
                name="email"
                label="Email Address"
                {...this.form.register('email')}
                error={this.form.errors?.email} />
            </div>
            <div class="col-12">
              <form-control-text
                name="phone"
                label="Phone"
                {...this.form.register('phone')}
                error={this.form.errors?.phone} />
            </div>
            <div class="col-12">
              <justifi-business-representative
                form={this.form}
                errors={this.form.errors}>
              </justifi-business-representative>
            </div>
            <div class="col-12">
              <button
                class="btn btn-primary"
                type="submit">Submit</button>
            </div>
          </div>
        </form>
      </Host>
    );
  }

}
