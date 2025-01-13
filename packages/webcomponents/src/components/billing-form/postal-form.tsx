import { Component, h, State, Prop, Method, Host } from '@stencil/core';
import { PostalFormSchema, PostalFormFields } from './billing-form-schema';
import { FormController } from '../../ui-components/form/form';
import { numberOnlyHandler } from '../../ui-components/form/utils';

@Component({
  tag: 'justifi-postal-form',
})
export class PostalForm {
  /**
   * (Optional) A label for the form.
   */
  @Prop({ mutable: true }) legend?: string;
  @State() formController: FormController;
  @State() billingInfo: {}
  @State() errors: any = {};

  componentWillLoad() {
    this.formController = new FormController(PostalFormSchema);
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
  async getValues(): Promise<PostalFormFields> {
    return this.formController.values.getValue();
  }

  @Method()
  async fill(fields: PostalFormFields) {
    this.formController.setInitialValues(fields);
  }

  @Method()
  async validate(): Promise<{ isValid: boolean }> {
    let isValid: boolean = await this.formController.validate();
    return { isValid: isValid };
  }

  render() {

    const postalFormDefaultValue = this.formController.getInitialValues();

    return (
      <Host>
        <form>
          <fieldset>
            {this.legend && <legend>{this.legend}</legend>}
            <div class="row gy-3">
              <div class="col-12">
                <form-control-text
                  name='address_postal_code'
                  label="ZIP"
                  defaultValue={postalFormDefaultValue.address_postal_code}
                  errorText={this.errors.address_postal_code}
                  inputHandler={this.inputHandler}
                  maxLength={5}
                  keyDownHandler={numberOnlyHandler}
                />
              </div>
            </div>
          </fieldset>
        </form>
      </Host>
    );
  }
}
