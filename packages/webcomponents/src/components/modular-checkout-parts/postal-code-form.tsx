import { Component, h, Method, State } from "@stencil/core";
import { StyledHost } from "../../ui-components";
import { numberOnlyHandler } from "../../ui-components/form/utils";
import { FormController } from "../../ui-components/form/form";
import { BillingFormFields, billingFormSchema } from "./billing-form-schema";
import { onChange } from "../../store/checkout.store";

@Component({
  tag: "justifi-postal-code-form",
  shadow: true,
})
export class PostalCodeForm {
  unsubscribe: () => void;
  @State() formController: FormController;
  @State() billingInfo: {}
  @State() errors: any = {};

  connectedCallback() {
    this.unsubscribe = onChange('billingFormFields', (newValue: BillingFormFields) => {
      this.formController.setInitialValues(newValue);
    });
  }

  disconnectedCallback() {
    this.unsubscribe?.();
  }

  componentWillLoad() {
    this.formController = new FormController(billingFormSchema(true));
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
        <form>
          <form-control-text
            name='address_postal_code'
            label="ZIP"
            defaultValue={billingFormDefaultValue.address_postal_code}
            errorText={this.errors.address_postal_code}
            inputHandler={this.inputHandler}
            maxLength={5}
            keyDownHandler={numberOnlyHandler}
          />
        </form>
      </StyledHost>
    );
  }
}
