import { Component, Host, h, State, Prop } from '@stencil/core';

@Component({
  tag: 'justifi-business-representative',
  styleUrl: 'business-representative.scss',
  shadow: true,
})
export class BusinessRepresentative {
  @Prop() hideSubmit?: string;
  @Prop() submitButtonText?: string;
  @Prop() legend?: string;
  // "name": "Person Name",
  // "title": "Mr.",
  // "email": "person.name@justifi.ai",
  // "phone": "6124011111",
  // "dob_day": "01",
  // "dob_month": "01",
  // "dob_year": "1980",
  // "identification_number": "123456789",
  // "is_owner": true,
  // 
  //
  // Allow metadata to be passed on submit?
  // "metadata": {
  //   "language": "english",
  //   "social_network": "@person"
  // },
  //
  //
  // Make this a component / nested field set
  // "address": {
  //   "line1": "123 Example St",
  //   "line2": "Suite 101",
  //   "city": "Minneapolis",
  //   "state": "MN",
  //   "postal_code": "55555",
  //   "country": "USA"
  // }
  @State() representativeFields = {
    name: '',
    title: '',
    email: '',
    phone: '',
    dob_day: '',
    dob_month: '',
    dob_year: '',
    identification_number: '',
    is_owner: false,
  };
  @State() representativeFieldsErrors: any = {};

  toggleIsOwner() {
    this.representativeFields.is_owner = !this.representativeFields.is_owner
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <fieldset>
          <legend>{(this.legend) ? this.legend : 'Business Entity'}</legend>
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
                  Is this the owner?
                </label>
              </div>
            </div>

            <div class="col-12">
              <justifi-business-address />
            </div>

            {(this.hideSubmit) ? '' : (
              <div class="col-12">
                <button type="submit" class="btn btn-primary">
                  {(this.submitButtonText) ? this.submitButtonText : 'Submit'}
                </button>
              </div>
            )}
          </div>
        </fieldset>
      </Host >
    );
  }

}
