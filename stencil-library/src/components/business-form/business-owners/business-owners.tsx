import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
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
  @State() defaultValues: any[] = [];
  @State() errors: any[] = [];
  @State() owners: BusinessOwner[] = [];

  @Watch('owners')
  handleOwnersChange(newValues: any) {
    this.formController.setValues({ owners: newValues });
  }

  componentDidLoad() {
    this.formController.defaultValues.subscribe(defaultValues => (this.defaultValues = { ...defaultValues.owners }));
    this.formController.errors.subscribe(errors => (this.errors = { ...errors.owners }));
  }

  inputHandler(name: string, value: string, index: number): void {
    this.owners[index][name] = value;
    this.owners = [...this.owners];
  }

  addOwner(event: MouseEvent): void {
    event.preventDefault();
    this.owners.push(new BusinessOwner());
    this.owners = [...this.owners];
  }

  removeOwner(event: MouseEvent, index: number): void {
    event.preventDefault();
    this.owners.splice(index, 1);
    this.owners = [...this.owners];
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <fieldset>
          <legend>Owners</legend>
          {this.owners.map((_owner: BusinessOwner, index: number) => {
            return (
              <div class="row gx-2 gy-2">
                <div class="col-12">
                  <form-control-text
                    name="name"
                    label="Full Name"
                    defaultValue={this.defaultValues[index]?.name}
                    error={this.errors[index]?.name}
                    inputHandler={(name, value) => this.inputHandler(name, value, index)}
                  />

                  <form-control-text
                    name="title"
                    label="Title"
                    defaultValue={this.defaultValues[index]?.title}
                    error={this.errors[index]?.title}
                    inputHandler={(name, value) => this.inputHandler(name, value, index)}
                  />

                  <form-control-text
                    name="email"
                    label="Email"
                    defaultValue={this.defaultValues[index]?.email}
                    error={this.errors[index]?.email}
                    inputHandler={(name, value) => this.inputHandler(name, value, index)}
                  />

                  <form-control-text
                    name="phone"
                    label="Phone"
                    defaultValue={this.defaultValues[index]?.phone}
                    error={this.errors[index]?.phone}
                    inputHandler={(name, value) => this.inputHandler(name, value, index)}
                  />
                </div>
                <div class="col-4">
                  <form-control-text
                    name="dob_day"
                    label="Date of Birth - Day"
                    defaultValue={this.defaultValues[index]?.dob_day}
                    error={this.errors[index]?.dob_day}
                    inputHandler={(name, value) => this.inputHandler(name, value, index)}
                  />
                </div>

                <div class="col-4">
                  <form-control-text
                    name="dob_month"
                    label="Date of Birth - Month"
                    defaultValue={this.defaultValues[index]?.dob_month}
                    error={this.errors[index]?.dob_month}
                    inputHandler={(name, value) => this.inputHandler(name, value, index)}
                  />
                </div>

                <div class="col-4">
                  <form-control-text
                    name="dob_year"
                    label="Date of Birth - Year"
                    defaultValue={this.defaultValues[index]?.dob_year}
                    error={this.errors[index]?.dob_year}
                    inputHandler={(name, value) => this.inputHandler(name, value, index)}
                  />
                </div>
                <div>
                  <form-control-text
                    name="identification_number"
                    label="Identification Number"
                    defaultValue={this.defaultValues[index]?.identification_number}
                    error={this.errors[index]?.identification_number}
                    inputHandler={(name, value) => this.inputHandler(name, value, index)}
                  />

                  {/* Assuming address is a single line text input for simplicity */}
                  <form-control-text
                    name="address"
                    label="Address"
                    defaultValue={this.defaultValues[index]?.address}
                    error={this.errors[index]?.address}
                    inputHandler={(name, value) => this.inputHandler(name, value, index)}
                  />

                  <button type="button" class="btn" onClick={event => this.removeOwner(event, index)}>
                    - Remove owner
                  </button>
                </div>
              </div>
            );
          })}
          <button type="button" class="btn" onClick={event => this.addOwner(event)}>
            + Add an owner
          </button>
        </fieldset>
      </Host>
    );
  }
}
