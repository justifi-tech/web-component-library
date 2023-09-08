import { Component, Host, h, Prop } from '@stencil/core';
import { FormController } from '../form/form';
import businessFormSchema from './business-form-schema';
import { Api } from '../../api';

/**
 * @exportedPart label: Label for inputs
 * @exportedPart input: The input fields
 * @exportedPart input-invalid: Invalid state for inputfs
 */
@Component({
  tag: 'justifi-business-form',
  styleUrl: 'business-form.scss',
})
export class BusinessForm {
  @Prop() authToken: string;
  @Prop() businessId?: string;

  private formController: FormController;
  private api: any;

  constructor() {
    this.sendData = this.sendData.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentWillLoad() {
    this.formController = new FormController(businessFormSchema);
    this.api = Api(this.authToken, process.env.JUSTIFI_API_ENTITIES_ENDPOINT);

    if (this.businessId) {
      this.fetchData(this.businessId);
    }
  }

  // Remove unecessary props from the form data
  parseForPatching({ legal_name, website_url, email, phone, doing_business_as, business_type, business_structure, industry, tax_id }) {
    return {
      legal_name,
      website_url,
      email,
      phone,
      doing_business_as,
      business_type,
      business_structure,
      industry,
      tax_id,
    };
  }

  async sendData() {
    try {
      const data = this.formController.values.getValue();

      // Conditionally making either POST or PATCH request
      if (this.businessId) {
        const payload = this.parseForPatching(data);
        const response = await this.api.patch(`entities/business/${this.businessId}`, JSON.stringify(payload));
        console.log('Server response from PATCH:', response);
      } else {
        const response = await this.api.post('entities/business', JSON.stringify(data));
        console.log('Server response from POST:', response);
      }
    } catch (error) {
      console.error('Error sending data:', error);
    }
  }

  async fetchData(businessId) {
    try {
      const response = await this.api.get(`entities/business/${businessId}`);
      this.formController.setValues(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  validateAndSubmit(event: any) {
    event.preventDefault();
    this.formController.validateAndSubmit(this.sendData);
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <h1>Business Information</h1>
        <form onSubmit={event => this.validateAndSubmit(event)}>
          <div class="row gy-6 gap-3">
            <div class="col-12">
              <justifi-business-generic-info formController={this.formController} />
            </div>
            <div class="col-12">
              <justifi-legal-address-form formController={this.formController} legend="Legal Address" />
            </div>
            <div class="col-12">
              <justifi-additional-questions formController={this.formController} />
            </div>
            <div class="col-12">
              <justifi-business-representative formController={this.formController} />
            </div>
            <div class="col-12">
              <justifi-business-owners formController={this.formController} />
            </div>
            <div class="col-12 d-flex flex-row-reverse">
              <button type="submit" class="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        </form>
      </Host>
    );
  }
}
