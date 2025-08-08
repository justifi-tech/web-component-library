import { Component, h, State, Prop, Method } from '@stencil/core';
import { BillingFormFields, nameOnlySchema } from './billing-form-schema';
import { billingForm } from '../../../styles/parts';
import { FormController } from '../../../ui-components/form/form';
import { StyledHost } from '../../../ui-components';

@Component({
  tag: 'justifi-bank-account-billing-form-simple',
  shadow: true,
})
export class BankAccountBillingFormSimple {
  @State() formController: FormController;
  @State() billingInfo: {}
  @State() errors: any = {};

  @Prop({ mutable: true }) legend?: string;

  componentWillLoad() {
    this.formController = new FormController(nameOnlySchema());
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
  async validate(): Promise<{ isValid: boolean, errors: any }> {
    const isValid: boolean = await this.formController.validate();
    const errors = this.formController.errors.getValue();
    return { isValid, errors };
  }

  render() {
    const billingFormDefaultValue = this.formController.getInitialValues();

    return (
      <StyledHost>
        <div part={billingForm} class="mt-4">
          <form>
            <fieldset>
              {this.legend && (
                <legend>{this.legend}</legend>
              )}
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
              </div>
            </fieldset>
          </form>
        </div>
      </StyledHost>
    );
  }
}
