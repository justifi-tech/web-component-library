import { Component, Host, h, Prop, State, Listen, Method } from '@stencil/core';
import { ValidationError } from 'yup';
import { Api } from '../../api';
import BusinessSchema, { BusinessStructureOptions, BusinessTypeOptions, Business } from './business-form-schema';


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
    const businessClone = { ...this.business };
    if (data.name) {
      businessClone[data.name] = data.value;
      this.business = businessClone;
    }
  }

  @Method()
  async submit(event) {
    event.preventDefault();

    const newErrors = {};
    let isValid: boolean = true;

    try {
      await BusinessSchema.validate(this.business, { abortEarly: false });
    } catch (err) {
      isValid = false;
      err.inner.map((item: ValidationError) => {
        newErrors[item.path] = item.message;
      });
    }

    this.businessInfoFieldsErrors = newErrors;

    if (!isValid) return;

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
              <text-input
                name="legal_name"
                label="Legal Name"
                defaultValue={this.business.legal_name}
                error={this.businessInfoFieldsErrors.legal_name} />
            </div>
            <div class="col-12">
              <text-input
                name="doing_business_as"
                label="Doing Business As (DBA)"
                defaultValue={this.business.doing_business_as}
                error={this.businessInfoFieldsErrors.doing_business_as} />
            </div>
            <div class="col-12">
              <select-input
                name="business_type"
                label="Business Type"
                options={BusinessTypeOptions}
                defaultValue={this.business.business_type}
                error={this.businessInfoFieldsErrors.business_type} />
            </div>
            <div class="col-12">
              <select-input
                name="business_structure"
                label="Business Structure"
                options={BusinessStructureOptions}
                defaultValue={this.business.business_structure}
                error={this.businessInfoFieldsErrors.business_structure} />
            </div>
            <div class="col-12">
              <text-input
                name="industry"
                label="Industry"
                defaultValue={this.business.industry}
                error={this.businessInfoFieldsErrors.industry} />
            </div>
            <div class="col-12">
              <text-input
                name="website_url"
                label="Website URL"
                defaultValue={this.business.website_url}
                error={this.businessInfoFieldsErrors.website_url} />
            </div>
            <div class="col-12">
              <text-input
                name="email"
                label="Email Address"
                defaultValue={this.business.email}
                error={this.businessInfoFieldsErrors.email} />
            </div>
            <div class="col-12">
              <text-input
                name="phone"
                label="Phone"
                defaultValue={this.business.phone}
                error={this.businessInfoFieldsErrors.phone} />
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
