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
  shadow: true,
})
export class BusinessOwners {
  @Prop() formController: FormController
  @State() errors: any = {};
  @State() defaultValues: any = {};
  @State() owners: BusinessOwner[] = [];

  @Watch('owners')
  handleRepresentativeChange(newValues: any) {
    this.formController.setValues(newValues);
  }

  componentDidLoad() {
    this.formController.errors.subscribe((errors) => this.errors = { ...errors });
    this.formController.defaultValues.subscribe((defaultValues) => this.defaultValues = { ...defaultValues });
  }

  inputHandler(name: string, value: string, index: number) {
    this.owners[index][name] = value;
  };

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <fieldset>
          <legend>Representative</legend>
          {this.owners.map((owner: any, index: number) => {
            <div class="row gx-2 gy-2">
              <div class="col-12">
                <form-control-text
                  name="name"
                  label="Full Name"
                  defaultValue={this.defaultValues[index].name}
                  error={this.errors[index].name}
                  inputHandler={(name, value) => this.inputHandler(name, value, index)} />
              </div>
            </div>
          })}
          <button onClick={() => this.owners.push(new BusinessOwner())}>+ Add an owner</button>
        </fieldset>
      </Host>
    );
  }

}
