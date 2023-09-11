import { Component, Host, h, Prop, State } from '@stencil/core';
import { FormController } from '../../form/form';

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
    return (
      <Host exportparts="label,input,input-invalid">
        <fieldset class="mb-4">
          {!!this.owners.length && <legend>Owners</legend>}
          {!!this?.owners.length &&
            this.owners.map((_owner: BusinessOwner, index: number) => {
              return (
                <div class="row gx-2 gy-2 mb-4">
                  <div class="col-12">
                    <div class="row mb-3">
                      <div class="col-12 col-md-6">
                        <form-control-text
                          name="name"
                          label="Full Name"
                          defaultValue={this.owners[index]?.name}
                          error={this.errors[index]?.name}
                          inputHandler={(name, value) =>
                            this.inputHandler(name, value, index)
                          }
                          class="form-control"
                        />
                      </div>
                      <div class="col-12 col-md-6">
                        <form-control-text
                          name="title"
                          label="Title"
                          defaultValue={this.owners[index]?.title}
                          error={this.errors[index]?.title}
                          inputHandler={(name, value) =>
                            this.inputHandler(name, value, index)
                          }
                          class="form-control"
                        />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <div class="col-12 col-md-6">
                        <form-control-text
                          name="email"
                          label="Email"
                          defaultValue={this.owners[index]?.email}
                          error={this.errors[index]?.email}
                          inputHandler={(name, value) =>
                            this.inputHandler(name, value, index)
                          }
                          class="form-control"
                        />
                      </div>
                      <div class="col-12 col-md-6">
                        <form-control-text
                          name="phone"
                          label="Phone"
                          defaultValue={this.owners[index]?.phone}
                          error={this.errors[index]?.phone}
                          inputHandler={(name, value) =>
                            this.inputHandler(name, value, index)
                          }
                          class="form-control"
                        />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <div class="col-12 col-md-4">
                        <form-control-text
                          name="dob_day"
                          label="Date of Birth - Day"
                          defaultValue={this.owners[index]?.dob_day}
                          error={this.errors[index]?.dob_day}
                          inputHandler={(name, value) =>
                            this.inputHandler(name, value, index)
                          }
                          class="form-control"
                        />
                      </div>
                      <div class="col-12 col-md-4">
                        <form-control-text
                          name="dob_month"
                          label="Date of Birth - Month"
                          defaultValue={this.owners[index]?.dob_month}
                          error={this.errors[index]?.dob_month}
                          inputHandler={(name, value) =>
                            this.inputHandler(name, value, index)
                          }
                          class="form-control"
                        />
                      </div>
                      <div class="col-12 col-md-4">
                        <form-control-text
                          name="dob_year"
                          label="Date of Birth - Year"
                          defaultValue={this.owners[index]?.dob_year}
                          error={this.errors[index]?.dob_year}
                          inputHandler={(name, value) =>
                            this.inputHandler(name, value, index)
                          }
                          class="form-control"
                        />
                      </div>
                    </div>

                    <div class="mb-3">
                      <form-control-text
                        name="identification_number"
                        label="Identification Number"
                        defaultValue={this.owners[index]?.identification_number}
                        error={this.errors[index]?.identification_number}
                        inputHandler={(name, value) =>
                          this.inputHandler(name, value, index)
                        }
                        class="form-control"
                      />
                    </div>

                    <div class="grid gap-3">
                      <legend class="mb-3">Owner Address:</legend>

                      <div class="row mb-3">
                        <div class="col-12 col-md-6">
                          <form-control-text
                            name="line1"
                            label="Street Address"
                            defaultValue={this.owners[index]?.address?.line1}
                            error={this.errors[index]?.address?.line1}
                            inputHandler={(_name, value) => {
                              this.owners[index].address.line1 = value;
                              this.owners = [...this.owners];
                            }}
                            class="form-control"
                          />
                        </div>
                        <div class="col-12 col-md-6">
                          <form-control-text
                            name="city"
                            label="City"
                            defaultValue={this.owners[index]?.address?.city}
                            error={this.errors[index]?.address?.city}
                            inputHandler={(_name, value) => {
                              this.owners[index].address.city = value;
                              this.owners = [...this.owners];
                            }}
                            class="form-control"
                          />
                        </div>
                      </div>

                      <div class="row mb-3">
                        <div class="col-12 col-md-6">
                          <form-control-text
                            name="state"
                            label="State"
                            defaultValue={this.owners[index]?.address?.state}
                            error={this.errors[index]?.address?.state}
                            inputHandler={(_name, value) => {
                              this.owners[index].address.state = value;
                              this.owners = [...this.owners];
                            }}
                            class="form-control"
                          />
                        </div>
                        <div class="col-12 col-md-6">
                          <form-control-text
                            name="postal_code"
                            label="Postal Code"
                            defaultValue={
                              this.owners[index]?.address?.postal_code
                            }
                            error={this.errors[index]?.address?.postal_code}
                            inputHandler={(_name, value) => {
                              this.owners[index].address.postal_code = value;
                              this.owners = [...this.owners];
                            }}
                            class="form-control"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      class="btn btn-danger"
                      onClick={event => this.removeOwner(event, index)}
                    >
                      - Remove owner
                    </button>
                  </div>
                </div>
              );
            })}
          <div class="row gy-3">
            <div class="col-12">
              <button
                type="button"
                class="btn btn-primary"
                onClick={event => this.addOwner(event)}
              >
                + Add an owner
              </button>
            </div>
          </div>
        </fieldset>
      </Host>
    );
  }
}
