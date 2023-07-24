import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { FormController } from '../../form/form';

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
  @State() owners: any = [];

  @Watch('owners')
  handleRepresentativeChange(newValues: any) {
    this.formController.setValues(newValues);
  }

  componentDidLoad() {
    this.formController.errors.subscribe((errors) => this.errors = { ...errors });
    this.formController.defaultValues.subscribe((defaultValues) => this.defaultValues = { ...defaultValues });
  }

  // inputHandler(name: string, value: string) {
  // };

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
      </Host>
    );
  }

}
