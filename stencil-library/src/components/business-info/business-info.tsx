import { Component, Host, h, Prop, State, Listen, Method } from '@stencil/core';
import { Api } from '../../api';
import BusinessInfoSchema, { Business, BusinessStructureOptions, BusinessTypeOptions } from './business-info-schema';
import FormController from '../form/form-controller';


/**
 * @exportedPart label: Label for inputs
 * @exportedPart input: The input fields
 * @exportedPart input-invalid: Invalid state for inputfs
 */
@Component({
  tag: 'justifi-business-info',
  styleUrl: 'business-info.scss',
  shadow: true,
})
export class BusinessInfo {
  @Prop() authToken: string;
  @Prop() businessId?: string;
  @State() business = new Business();
  @State() businessInfoFieldsErrors: any = {};
  @State() form = new FormController({}, BusinessInfoSchema);

  private endpoint: string = 'entities/business';

  componentDidMount() {
    if (this.businessId) {
      this.fetchBusinessInfo();
    }
  }

  async fetchBusinessInfo(): Promise<void> {
    // fetch data and pre-fill form
    const businessInfoPrefillData = await Api(this.authToken).get(`${this.endpoint}/${this.businessId}`);
    this.business = businessInfoPrefillData;
  };

  async sendBusinessInfo(data): Promise<void> {
    return Api(this.authToken).post(this.endpoint, data);
  };

  @Listen('fieldReceivedInput')
  setFormValue(event) {
    const data = event.detail;
    const businessInfoClone = { ...this.business };
    if (data.name) {
      businessInfoClone[data.name] = data.value;
      this.business = businessInfoClone;
    }
  }

  @Method()
  async submit(event) {
    event.preventDefault();
    const validatedForm = await this.form.validate();
    this.businessInfoFieldsErrors = validatedForm.errors;

    console.log('validatedForm', validatedForm);

    if (!validatedForm.isValid) return;

    const response = await this.sendBusinessInfo(this.business);
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
