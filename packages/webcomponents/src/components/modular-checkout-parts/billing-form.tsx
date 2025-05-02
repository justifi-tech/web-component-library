import { Component, h, State, Method } from '@stencil/core';
import { BillingFormFields, billingFormSchema } from './billing-form-schema';
import { billingForm } from '../../styles/parts';
import { numberOnlyHandler } from '../../ui-components/form/utils';
import StateOptions from '../../utils/state-options';
import { FormController } from '../../ui-components/form/form';
import { StyledHost } from '../../ui-components';

@Component({
  tag: 'justifi-billing-information-form',
  shadow: true
})
export class BillingInformationForm {
  @State() formController: FormController;
  @State() billingInfo: {}
  @State() errors: any = {};

  componentWillLoad() {
    this.formController = new FormController(billingFormSchema());
  }

  componentDidLoad() {
    this.formController.values.subscribe(values =>
      this.billingInfo = { ...values }
    );
    this.formController.errors.subscribe(errors => {
      this.errors = { ...errors };
    });
  }

  inputHandler = (name: string, value: string) => {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      [name]: value,
    });
  }

  @Method()
  async getValues(): Promise<BillingFormFields> {
    return this.formController.values.getValue();
  }

  @Method()
  async fill(fields: BillingFormFields) {
    this.formController.setInitialValues(fields);
  }

  @Method()
  async validate(): Promise<{ isValid: boolean }> {
    let isValid: boolean = await this.formController.validate();
    return { isValid: isValid };
  }

  render() {

    const billingFormDefaultValue = this.formController.getInitialValues();

    return (
      <StyledHost>
        <div part={billingForm}>
          <form>
            <fieldset>
              <div class="row gy-3">
                <div class="col-12">
                  <form-control-text
                    name='name'
                    label='Full Name'
                    defaultValue={billingFormDefaultValue.name}
                    errorText={this.errors.name}
                    inputHandler={this.inputHandler}
                  />
                </div>
                <div class="col-12">
                  <form-control-text
                    name='address_line1'
                    label='Street Address'
                    defaultValue={billingFormDefaultValue.address_line1}
                    errorText={this.errors.address_line1}
                    inputHandler={this.inputHandler}
                  />
                </div>
                <div class="col-12">
                  <form-control-text
                    name='address_line2'
                    label="Apartment, Suite, etc. (optional)"
                    defaultValue={billingFormDefaultValue.address_line2}
                    errorText={this.errors.address_line2}
                    inputHandler={this.inputHandler}
                  />
                </div>
                <div class="col-12">
                  <form-control-text
                    name='address_city'
                    label="City"
                    defaultValue={billingFormDefaultValue.address_city}
                    errorText={this.errors.address_city}
                    inputHandler={this.inputHandler}
                  />
                </div>
                <div class="col-12">
                  <form-control-select
                    name='address_state'
                    label='State'
                    options={StateOptions}
                    defaultValue={billingFormDefaultValue.address_state}
                    errorText={this.errors.address_state}
                    inputHandler={this.inputHandler}
                  />
                </div>
                <div class="col-12">
                  <form-control-text
                    name='address_postal_code'
                    label="ZIP"
                    defaultValue={billingFormDefaultValue.address_postal_code}
                    errorText={this.errors.address_postal_code}
                    inputHandler={this.inputHandler}
                    maxLength={5}
                    keyDownHandler={numberOnlyHandler}
                  />
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      </StyledHost>
    );
  }
}
