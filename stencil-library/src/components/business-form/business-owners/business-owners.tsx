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
  @State() errors: any[] = [];
  @State() owners: BusinessOwner[] = [];

  @Watch('owners')
  handleOwnersChange(newValues: any) {
    this.formController.setValues({ owners: newValues });
  };

  componentDidLoad() {
    this.formController.errors.subscribe((errors) => this.errors = { ...errors.owners });
  };

  inputHandler(name: string, value: string, index: number) {
    this.owners[index][name] = value;
    this.owners = [...this.owners]
  };

  addOwner() {
    this.owners.push(new BusinessOwner());
    this.owners = [...this.owners];
  };

  removeOwner(index: number) {
    this.owners.splice(index, 1);
    this.owners = [...this.owners];
  };

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <fieldset>
          <legend>Owners</legend>
          {this.owners.map((owner: BusinessOwner, index: number) => {
            return (
              <div class="row gx-2 gy-2">
                <div class="col-12">
                  {owner}
                  <form-control-text
                    name="name"
                    label="Full Name"
                    error={this.errors[index]?.name}
                    inputHandler={(name, value) => this.inputHandler(name, value, index)} />
                  <form-control-text
                    name="title"
                    label="Title"
                    error={this.errors[index]?.title}
                    inputHandler={(name, value) => this.inputHandler(name, value, index)} />
                  <button onClick={() => this.removeOwner(index)}>- Remove owner</button>
                </div>
              </div>
            );
          })}
          <button onClick={() => this.addOwner()}>+ Add an owner</button>
        </fieldset>
      </Host>
    );
  }

}
