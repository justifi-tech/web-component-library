import { Component, h, State, Prop, Method, Host } from '@stencil/core';
import { BillingFormFields, postalOnlySchema } from './billing-form-schema';
import { billingForm } from '../../../styles/parts';
import { numberOnlyHandler } from '../../../ui-components/form/utils';
import { FormController } from '../../../ui-components/form/form';

@Component({
  tag: 'justifi-card-billing-form-simple',
})
export class CardBillingFormSimple {
  @State() formController: FormController;
  @State() billingInfo: {}
  @State() errors: any = {};
  
  @Prop({ mutable: true }) legend?: string;

  componentWillLoad() {
    this.formController = new FormController(postalOnlySchema());
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
      <Host>
        <div part={billingForm} class="mt-4">
          <form>
            <fieldset>
              {this.legend && (
                <legend>{this.legend}</legend>
              )}
              <div class="row gy-3">
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
      </Host>
    );
  }
}