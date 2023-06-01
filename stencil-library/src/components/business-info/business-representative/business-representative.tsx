import { Component, Host, h, State, Method, Listen } from '@stencil/core';
import { ValidationError } from 'yup';
import RepresentativeFormSchema, { IBusinessRepresentative } from './business-representative-schema';


@Component({
  tag: 'justifi-business-representative',
  styleUrl: 'business-representative.scss',
  shadow: true,
})
export class BusinessRepresentative {
  @State() representativeFields: IBusinessRepresentative = {
    name: '',
    title: '',
    email: '',
    phone: '',
    dob_day: '',
    dob_month: '',
    dob_year: '',
    identification_number: '',
    is_owner: false,
    metadata: {},
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: ''
    }
  };
  @State() representativeFieldsErrors: any = {};

  private addressFormRef?: HTMLJustifiBusinessAddressElement;

  private toggleIsOwner() {
    this.representativeFields.is_owner = !this.representativeFields.is_owner
  }

  @Listen('fieldReceivedInput')
  setFormValue(event) {
    const data = event.detail;
    const billingFieldsClone = { ...this.representativeFields };
    if (data.name) {
      billingFieldsClone[data.name] = data.value;
    }
    this.representativeFields = billingFieldsClone;
  }

  @Method()
  async getForm(): Promise<{ isValid: boolean, values: IBusinessRepresentative }> {
    const addressForm = await this.addressFormRef.getForm();
    this.representativeFields.address = addressForm.values;

    const newErrors = {};
    let isValid: boolean = true;

    try {
      await RepresentativeFormSchema.validate(this.representativeFields, { abortEarly: false });
    } catch (err) {
      isValid = false;
      err.inner.map((item: ValidationError) => {
        newErrors[item.path] = item.message;
      });
    }

    this.representativeFieldsErrors = newErrors;

    return { isValid: isValid && addressForm.isValid, values: this.representativeFields }
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <fieldset>
          <legend>Representative</legend>
          <div class="row gx-2 gy-2">
            <div class="col-8">
              <text-input
                name="name"
                label="Full Name"
                defaultValue={this.representativeFields?.name}
                error={this.representativeFieldsErrors?.name} />
            </div>

            <div class="col-4">
              <select-input
                name="title"
                label="Prefix"
                options={[{ label: 'Mrs.', value: 'Mrs.' }]}
                defaultValue={this.representativeFields?.title}
                error={this.representativeFieldsErrors?.title} />
            </div>

            <div class="col-12">
              <text-input
                name="email"
                label="Email"
                defaultValue={this.representativeFields?.email}
                error={this.representativeFieldsErrors?.email} />
            </div>

            <div class="col-12">
              <text-input
                name="phone"
                label="Phone"
                defaultValue={this.representativeFields?.phone}
                error={this.representativeFieldsErrors?.phone} />
            </div>

            <div class="col-12">
              <label part="label" class="form-label">Birth Date</label>
            </div>

            <div class="col-4">
              <text-input
                name="dob_day"
                label="Day"
                defaultValue={this.representativeFields?.dob_day}
                error={this.representativeFieldsErrors?.dob_day} />
            </div>

            <div class="col-4">
              <text-input
                name="dob_month"
                label="Month"
                defaultValue={this.representativeFields?.dob_month}
                error={this.representativeFieldsErrors?.dob_month} />
            </div>

            <div class="col-4">
              <text-input
                name="dob_year"
                label="Year"
                defaultValue={this.representativeFields?.dob_year}
                error={this.representativeFieldsErrors?.dob_year} />
            </div>

            <div class="col-12">
              <text-input
                name="identification_number"
                label="EIN/SSN"
                defaultValue={this.representativeFields?.identification_number}
                error={this.representativeFieldsErrors?.identification_number} />
            </div>

            <div class="col-12">
              <div class="form-check">
                <input
                  type="checkbox"
                  id="is_owner_checkbox"
                  class="form-check-input"
                  onChange={() => this.toggleIsOwner()} />
                <label class="form-check-label" htmlFor="is_owner_checkbox">
                  Is this an owner?
                </label>
              </div>
            </div>

            <div class="col-12">
              <justifi-business-address ref={el => this.addressFormRef = el} />
            </div>
          </div>
        </fieldset>
      </Host >
    );
  }

}
