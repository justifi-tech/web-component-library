import { Component, Host, h, Prop, State, Method } from '@stencil/core';
import { Api } from '../../api';
import BusinessSchema, { BusinessStructureOptions, BusinessTypeOptions, Business } from './business-form-schema';
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
  @State() businessInfoFieldsErrors: any = {};
  @State() form = new FormController({}, BusinessSchema);

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

  @Method()
  async submit(event) {
    event.preventDefault();
    const validatedForm = await this.form.validate();
    this.businessInfoFieldsErrors = validatedForm.errors;

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
                {...this.form.register('legal_name')}
                label="Legal Name"
                error={this.form.errors?.legal_name}
              />
            </div>
            <div class="col-12">
              <form-control-text
                {...this.form.register('doing_business_as')}
                label="Doing Business As (DBA)"
                error={this.form.errors?.doing_business_as}
              />
            </div>
            <div class="col-12">
              <form-control-select
                {...this.form.register('business_type')}
                label="Business Type"
                error={this.form.errors?.business_type}
                options={BusinessTypeOptions}
              />
            </div>
            <div class="col-12">
              <form-control-select
                {...this.form.register('business_structure')}
                label="Business Structure"
                error={this.form.errors?.business_structure}
                options={BusinessStructureOptions}
              />
            </div>
            <div class="col-12">
              <form-control-text
                {...this.form.register('industry')}
                label="Industry"
                error={this.form.errors?.industry}
              />
            </div>
            <div class="col-12">
              <form-control-text
                {...this.form.register('website_url')}
                label="Website URL"
                error={this.form.errors?.website_url}
              />
            </div>
            <div class="col-12">
              <form-control-text
                {...this.form.register('email')}
                label="Email Address"
                error={this.form.errors?.email}
              />
            </div>
            <div class="col-12">
              <form-control-text
                {...this.form.register('phone')}
                label="Phone Number"
                error={this.form.errors?.phone}
              />
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
