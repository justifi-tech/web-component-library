import { Component, Host, h, Prop, State, Method } from '@stencil/core';
import { FormController } from '../../form/form';
import { IBusiness } from '../../../api/Business';
import { Api, IApiResponse } from '../../../api';
import { config } from '../../../../config';
import { additionQuestionsSchema } from '../../business-form/business-form-schema';
import { ClickEvents } from '../../business-form/BusinessFormEventTypes';

/**
 * @exportedPart label: Label for inputs
 * @exportedPart input: The input fields
 * @exportedPart input-invalid: Invalid state for inputfs
 */
@Component({
  tag: 'justifi-additional-questions-form-step',
})
export class AdditionalQuestionsFormStep {
  @Prop() authToken: string;
  @Prop() businessId: string;
  @Prop() previousStepButtonOnClick: () => void;
  @Prop() nextStepButtonOnClick: (clickEventName: ClickEvents) => void;
  @State() isLoading: boolean = false;
  @State() serverError: boolean = false;
  @State() errorMessage: string = '';
  @State() formController: FormController;
  @State() errors: any = {};
  @State() additional_questions: any = {};

  constructor() {
    this.inputHandler = this.inputHandler.bind(this);
    this.sendData = this.sendData.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }
  
  private api: any;

  get businessEndpoint() {
    return `entities/business/${this.businessId}`
  }

  private async fetchData() {
    this.isLoading = true;
    try {
      const response: IApiResponse<IBusiness> = await this.api.get(this.businessEndpoint);
      this.additional_questions = response.data.additional_questions;
      this.formController.setInitialValues(this.additional_questions);
    } catch (error) {
      this.serverError = true;
      this.errorMessage = `Error fetching data: ${error.message}`;
    } finally {
      this.isLoading = false;
    }
  }

  @Method()
  async validateAndSubmit() {
    this.formController.validateAndSubmit(this.sendData);
  };

  private async sendData() {
    // this.isLoading = true;
    try {
      const values = this.formController.values.getValue();
      console.log('values', values);
      await this.api.patch(this.businessEndpoint, JSON.stringify({ additional_questions: values}));
    } catch (error) {
      this.serverError = true;
      this.errorMessage = `Error sending data: ${error.message}`;
    } finally {
      // this.isLoading = false;
    }
  }

  componentWillLoad() {
    const missingAuthTokenMessage = 'Warning: Missing auth-token. The form will not be functional without it.';
    const missingBusinessIdMessage = 'Warning: Missing business-id. The form requires an existing business-id to function.';
    if (!this.authToken) console.error(missingAuthTokenMessage);
    if (!this.businessId) console.error(missingBusinessIdMessage);

    this.formController = new FormController(additionQuestionsSchema);
    this.api = Api(this.authToken, config.proxyApiOrigin);
    this.fetchData();
  }

  componentDidLoad() {
    this.formController.errors.subscribe(
      errors => (this.errors = { ...errors }),
    );
    // this.formController.values.subscribe(
    //   values =>
    //   (this.additional_questions = { ...values.additional_questions }),
    //   );
  }

  inputHandler(name: string, value: string) {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      [name]: value,
    });
  }

  render() {
    const additionalQuestionsDefaultValue =
      this.formController.getInitialValues();

    return (
      <Host exportparts="label,input,input-invalid">
        <form onSubmit={() => this.sendData}>
        <fieldset>
          <legend>Additional Questions</legend>
          <hr />
          <div class="row gy-3">
            <div class="col-12">
              <form-control-monetary
                name="business_revenue"
                label="Business Revenue"
                inputHandler={this.inputHandler}
                error={this.errors?.business_revenue}
                defaultValue={additionalQuestionsDefaultValue?.business_revenue}
              />
            </div>
            <div class="col-12">
              <form-control-monetary
                name="business_payment_volume"
                label="Business Payment Volume"
                inputHandler={this.inputHandler}
                error={this.errors?.business_payment_volume}
                defaultValue={
                  additionalQuestionsDefaultValue?.business_payment_volume
                }
              />
            </div>
            <div class="col-12">
              <form-control-monetary
                name="business_dispute_volume"
                label="Business Dispute Volume"
                inputHandler={this.inputHandler}
                error={this.errors?.business_dispute_volume}
                defaultValue={
                  additionalQuestionsDefaultValue?.business_dispute_volume
                }
              />
            </div>
            <div class="col-12">
              <form-control-monetary
                name="business_receivable_volume"
                label="Business Receivable Volume"
                inputHandler={this.inputHandler}
                error={
                  this.errors?.business_receivable_volume
                }
                defaultValue={
                  additionalQuestionsDefaultValue?.business_receivable_volume
                }
              />
            </div>
          </div>
        </fieldset>
        </form>
      </Host>
    );
  }
}
