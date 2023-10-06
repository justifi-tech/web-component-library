import { Component, Host, h, Prop, State } from '@stencil/core';
import { FormController } from '../form/form';
import businessFormSchema from './business-form-schema';
import { Api } from '../../api';
import { parseForPatching } from './helpers';


const componentStepMapping = {
  0: (formController) => <justifi-business-generic-info formController={formController} />,
  1: (formController) => <justifi-legal-address-form formController={formController} />,
  2: (formController) => <justifi-additional-questions formController={formController} />,
  3: (formController) => <justifi-business-representative formController={formController} />,
  4: (formController) => <justifi-business-owners formController={formController} />
};


/**
 * @exportedPart label: Label for inputs
 * @exportedPart input: The input fields
 * @exportedPart input-invalid: Invalid state for inputfs
 */
@Component({
  tag: 'justifi-business-form-stepped',
  styleUrl: 'business-form.scss',
})
export class BusinessFormStepped {
  @Prop() authToken: string;
  @Prop() businessId?: string;
  @State() isLoading: boolean = false;
  @State() currentStep: number = 0;

  private formController: FormController;
  private api: any;

  constructor() {
    this.sendData = this.sendData.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentWillLoad() {
    if (!this.authToken) {
      console.warn(
        'Warning: Missing auth-token. The form will not be functional without it.',
      );
    }

    this.formController = new FormController(businessFormSchema);

    this.api = Api(this.authToken, process.env.ENTITIES_ENDPOINT);

    if (this.businessId) {
      this.fetchData(this.businessId);
    } else {
      this.formController.setInitialValues({
        legal_address: {
          country: 'US',
        },
      });
    }
  }

  private async sendData() {
    this.isLoading = true;
    try {
      const data = this.formController.values.getValue();

      // Conditionally making either POST or PATCH request
      if (this.businessId) {
        const payload = parseForPatching(data);
        const response = await this.api.patch(
          `entities/business/${this.businessId}`,
          JSON.stringify(payload),
        );
        console.log('Server response from PATCH:', response);
      } else {
        const response = await this.api.post(
          'entities/business',
          JSON.stringify(data),
        );
        console.log('Server response from POST:', response);
      }
    } catch (error) {
      console.error('Error sending data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private async fetchData(businessId) {
    this.isLoading = true;
    try {
      const response = await this.api.get(`entities/business/${businessId}`);
      this.formController.setInitialValues(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private validateAndSubmit(event: any) {
    event.preventDefault();
    this.formController.validateAndSubmit(this.sendData);
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <h1>Business Information</h1>
        <form onSubmit={this.validateAndSubmit}>
          {componentStepMapping[this.currentStep](this.formController)}
          <div class="buttons">
            <button
              type="button"
              class="btn btn-secondary"
              onClick={() => {
                if (this.currentStep > 0) {
                  this.currentStep--;
                }
              }}
            >
              Previous
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              onClick={() => {
                if (this.currentStep < 4) {
                  this.currentStep++;
                }
              }}
            >
              Next
            </button>
            <button type="submit" class="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </Host>
    );
  }
}
