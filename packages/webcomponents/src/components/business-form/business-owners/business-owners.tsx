import { Component, Host, h, Prop, State } from '@stencil/core';
import { FormController } from '../../form/form';
import { PHONE_MASKS } from '../../../utils/phone-masks';

class BusinessOwner {
  name: string = '';
  title: string = '';
  email: string = '';
  phone: string = '';
  dob_day: string = '';
  dob_month: string = '';
  dob_year: string = '';
  identification_number: string = '';
  is_owner: boolean = true;
  metadata: any = {};
  address: any = {};
}

/**
 * @exportedPart label: Label for inputs
 * @exportedPart input: The input fields
 * @exportedPart input-invalid: Invalid state for inputfs
 */
@Component({
  tag: 'justifi-business-owners',
  styleUrl: 'business-owners.scss',
  shadow: false,
})
export class BusinessOwners {
  @Prop() formController: FormController;
  @State() errors: any[] = [];
  @State() owners: BusinessOwner[] = [];

  constructor() {
    this.inputHandler = this.inputHandler.bind(this);
    this.addOwner = this.addOwner.bind(this);
    this.removeOwner = this.removeOwner.bind(this);
  }

  componentDidLoad() {
    this.formController.errors.subscribe(errors => {
      this.errors = errors?.owners || [];
    });
    this.formController.values.subscribe(
      values => (this.owners = values?.owners || []),
    );
  }

  inputHandler(name: string, value: string, index: number): void {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      owners: this.owners.map((owner, i) => {
        if (i === index) {
          return {
            ...owner,
            [name]: value,
          };
        }
        return owner;
      }),
    });
  }

  addressInputHandler(name: string, value: string, index: number): void {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      owners: this.owners.map((owner, i) => {
        if (i === index) {
          return {
            ...owner,
            address: {
              ...owner.address,
              [name]: value,
            },
          };
        }
        return owner;
      }),
    });
  }

  addOwner(event: MouseEvent): void {
    event.preventDefault();

    this.formController.setValues({
      ...this.formController.values.getValue(),
      owners: [...this.owners, { ...new BusinessOwner() }],
    });
  }

  removeOwner(event: MouseEvent, index: number): void {
    event.preventDefault();
    this.formController.setValues({
      ...this.formController.values.getValue(),
      owners: this.owners.filter((_owner, i) => i !== index),
    });
  }

  render() {
    const ownersDefaultValue =
      this.formController.values.getValue().owners || [];

    return (
      <Host exportparts="label,input,input-invalid">
        <fieldset>
          <legend>Owners</legend>
          <hr />
          {this.owners.map((_owner: BusinessOwner, index: number) => {
            return (
              <div class="row gx-2 gy-2 mb-4">
                <div class="col-12">
                  <div class="row mb-3">
                    <div class="col-12 col-md-6">
                      <form-control-text
                        name="name"
                        label="Full Name"
                        defaultValue={ownersDefaultValue[index]?.name}
                        error={this.errors[index]?.name}
                        inputHandler={(name, value) =>
                          this.inputHandler(name, value, index)
                        }
                        disabled
                      />
                    </div>
                    <div class="col-12 col-md-6">
                      <form-control-text
                        name="title"
                        label="Title"
                        defaultValue={ownersDefaultValue[index]?.title}
                        error={this.errors[index]?.title}
                        inputHandler={(name, value) =>
                          this.inputHandler(name, value, index)
                        }
                        disabled
                      />
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-12 col-md-6">
                      <form-control-text
                        name="email"
                        label="Email"
                        defaultValue={ownersDefaultValue[index]?.email}
                        error={this.errors[index]?.email}
                        inputHandler={(name, value) =>
                          this.inputHandler(name, value, index)
                        }
                        disabled
                      />
                    </div>
                    <div class="col-12 col-md-6">
                      <form-control-number-masked
                        name="phone"
                        label="Phone"
                        defaultValue={ownersDefaultValue[index]?.phone}
                        error={this.errors[index]?.phone}
                        inputHandler={(name, value) =>
                          this.inputHandler(name, value, index)
                        }
                        mask={PHONE_MASKS.US}
                        disabled
                      />
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-12 col-md-4">
                      <form-control-datepart
                        name="dob_day"
                        label="Date of Birth - Day"
                        defaultValue={ownersDefaultValue[index]?.dob_day}
                        error={this.errors[index]?.dob_day}
                        inputHandler={(name, value) =>
                          this.inputHandler(name, value, index)
                        }
                        type="day"
                        disabled
                      />
                    </div>
                    <div class="col-12 col-md-4">
                      <form-control-datepart
                        name="dob_month"
                        label="Date of Birth - Month"
                        defaultValue={ownersDefaultValue[index]?.dob_month}
                        error={this.errors[index]?.dob_month}
                        inputHandler={(name, value) =>
                          this.inputHandler(name, value, index)
                        }
                        type="month"
                        disabled
                      />
                    </div>
                    <div class="col-12 col-md-4">
                      <form-control-datepart
                        name="dob_year"
                        label="Date of Birth - Year"
                        defaultValue={ownersDefaultValue[index]?.dob_year}
                        error={this.errors[index]?.dob_year}
                        inputHandler={(name, value) =>
                          this.inputHandler(name, value, index)
                        }
                        type="year"
                        disabled
                      />
                    </div>
                  </div>

                  <div class="mb-3">
                    <form-control-number
                      name="identification_number"
                      label="Identification Number"
                      defaultValue={
                        ownersDefaultValue[index]?.identification_number
                      }
                      error={this.errors[index]?.identification_number}
                      inputHandler={(name, value) =>
                        this.inputHandler(name, value, index)
                      }
                      disabled
                    />
                  </div>

                  <div class="grid gap-3">
                    <legend class="mb-3">Owner Address:</legend>

                    <div class="row mb-3">
                      <div class="col-12 col-md-6">
                        <form-control-text
                          name="line1"
                          label="Street Address"
                          defaultValue={
                            ownersDefaultValue[index]?.address?.line1
                          }
                          error={this.errors[index]?.address?.line1}
                          inputHandler={(name, value) =>
                            this.addressInputHandler(name, value, index)
                          }
                          disabled
                        />
                      </div>
                      <div class="col-12 col-md-6">
                        <form-control-text
                          name="city"
                          label="City"
                          defaultValue={
                            ownersDefaultValue[index]?.address?.city
                          }
                          error={this.errors[index]?.address?.city}
                          inputHandler={(name, value) =>
                            this.addressInputHandler(name, value, index)
                          }
                          disabled
                        />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <div class="col-12 col-md-6">
                        <form-control-text
                          name="state"
                          label="State"
                          defaultValue={
                            ownersDefaultValue[index]?.address?.state
                          }
                          error={this.errors[index]?.address?.state}
                          inputHandler={(name, value) =>
                            this.addressInputHandler(name, value, index)
                          }
                          disabled
                        />
                      </div>
                      <div class="col-12 col-md-6">
                        <form-control-number
                          name="postal_code"
                          label="Postal Code"
                          defaultValue={
                            ownersDefaultValue[index]?.address?.postal_code
                          }
                          error={this.errors[index]?.address?.postal_code}
                          inputHandler={(name, value) =>
                            this.addressInputHandler(name, value, index)
                          }
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  {/* <button
                    type="button"
                    class="btn btn-outline-danger"
                    onClick={event => this.removeOwner(event, index)}
                  >
                    Remove owner
                  </button> */}
                </div>
              </div>
            )
          })}
          {/* <div class="row gy-3">
            <div class="col-12">
              <button
                type="button"
                class="btn btn-outline-primary"
                onClick={event => this.addOwner(event)}
              >
                Add an owner
              </button>
            </div>
          </div> */}
        </fieldset>
      </Host>
    );
  }
}
