import { Component, Host, h, Prop } from '@stencil/core';
import { FormController } from '../form/form';
import BusinessFormSchema from './business-form-schema';

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
  private formController: FormController;

  constructor() {
    this.formController = new FormController(BusinessFormSchema);
  }

  sendData() {
    console.log('sendData');
  }

  validateAndSubmit(event: any) {
    event.preventDefault();
    this.formController.validateAndSubmit(this.sendData);
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <h1>Business Information</h1>
        <form onSubmit={event => this.validateAndSubmit(event)} class="container">
          <div class="row gy-6">
            <div class="col-12">
              <justifi-business-generic-info formController={this.formController} />
            </div>
            <div class="col-12">
              <justifi-legal-address-form formController={this.formController} legend="Legal Address" />
            </div>
            <div class="col-12">
              <justifi-business-representative formController={this.formController} />
            </div>
            <div class="col-12">
              <justifi-business-owners formController={this.formController} />
            </div>
            <div class="col-12">
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
