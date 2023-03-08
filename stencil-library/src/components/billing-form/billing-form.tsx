import { Component, Host, h, State } from '@stencil/core';
import { ValidationError } from 'yup';
import BillingFormSchema from './billing-form-schema';

interface BillingFormFields {
  address_line1: string;
  address_line2?: string;
  address_city: string;
  address_state: string;
  address_postal_code: string;
}

interface BillingFormFieldErrors {
  address_line1: string[];
  address_line2?: string[];
  address_city: string[];
  address_state: string[];
  address_postal_code: string[];
}

@Component({
  tag: 'billing-form',
  styleUrl: 'billing-form.css',
  shadow: true,
})
export class BillingForm {
  @State() billingFields: BillingFormFields = {
    address_line1: '',
    address_line2: '',
    address_city: '',
    address_state: '',
    address_postal_code: ''
  };

  @State() billingFieldErrors: BillingFormFieldErrors = {
    address_line1: [],
    address_line2: [],
    address_city: [],
    address_state: [],
    address_postal_code: []
  };

  setFormValue(event) {
    const target = event.target;
    const name = target.getAttribute('name');
    const billingFieldsClone = { ...this.billingFields };

    if (name) {
      billingFieldsClone[name] = target.value;
      this.billingFields = billingFieldsClone;
    }
  }

  async validate() {
    const billingFieldErrorsClone = { ...this.billingFieldErrors };
    try {
      await BillingFormSchema.validate(this.billingFields, { abortEarly: false })
    } catch (err) {
      err.inner.map((item: ValidationError) => {
        const fieldName = item.path;
        billingFieldErrorsClone[fieldName] = item?.errors;
        this.billingFieldErrors = billingFieldErrorsClone;
        console.log('this.billingFieldErrors', this.billingFieldErrors);
      });
    }
  }

  render() {
    return (
      <Host>
        <fieldset>
          <label>Street Address</label>
          <input
            name="address_line1"
            type="text"
            onInput={(event) => this.setFormValue(event)}
            value={this.billingFields.address_line1}
          />
          <div style={{ color: 'red' }}>
            {this.billingFieldErrors.address_line1.map((error) => {
              return <div>{error}</div>;
            })}
          </div>

          <label>Apartment, Suite, etc. (optional)</label>
          <input name="address_line2" type="text" onInput={(event) => this.setFormValue(event)} />

          <label>City</label>
          <input name="address_city" type="text" onInput={(event) => this.setFormValue(event)} />
          <div style={{ color: 'red' }}>
            {this.billingFieldErrors.address_city.map((error) => {
              return <div>{error}</div>;
            })}
          </div>

          <label>State</label>
          <input name="address_state" type="text" onInput={(event) => this.setFormValue(event)} />
          <div style={{ color: 'red' }}>
            {this.billingFieldErrors.address_state.map((error) => {
              return <div>{error}</div>;
            })}
          </div>

          <label>ZIP</label>
          <input name="address_postal_code" type="text" onInput={(event) => this.setFormValue(event)} />
          <div style={{ color: 'red' }}>
            {this.billingFieldErrors.address_postal_code.map((error) => {
              return <div>{error}</div>;
            })}
          </div>

          <button onClick={() => this.validate()}>Validate</button>
        </fieldset>
      </Host>
    );
  }

}
