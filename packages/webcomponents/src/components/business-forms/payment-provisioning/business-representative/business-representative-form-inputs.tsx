import { Component, h, Prop } from '@stencil/core';
import { FormController } from '../../../../ui-components/form/form';
import { updateAddressFormValues, updateDateOfBirthFormValues, updateFormValues } from '../../utils/input-handlers';
import { PHONE_MASKS, SSN_MASK } from '../../../../utils/form-input-masks';

@Component({
  tag: 'justifi-business-representative-form-inputs',
})
export class RepresentativeFormInputs {
  @Prop() representativeDefaultValue: any;
  @Prop() errors: any;
  @Prop() formController: FormController;

  inputHandler = (name: string, value: string) => {
    updateFormValues(this.formController, { [name]: value });
  }

  onAddressFormUpdate = (values: any): void => {
    updateAddressFormValues(this.formController, {
      ...this.formController.values.getValue().address,
      ...values,
    });
  }

  render() {
    return (
      <form>
        <fieldset>
          <div class="mb-4">
            <legend
              class="d-flex align-items-center justify-content-between mb-2"
              part="header-2"
            >
              Representative
              <form-control-tooltip
                helpText="The representative for your business needs to be someone who has significant control over managing your business’s finance. You will have an opportunity to add owners later in the form."
                className="ms-2"
              />
            </legend>
          </div>
          <div class="row gy-3">
            <div class="col-12 col-md-8">
              <form-control-text
                name="name"
                label="Full Name"
                defaultValue={this.representativeDefaultValue?.name}
                errorText={this.errors.name}
                inputHandler={this.inputHandler}
              />
            </div>
            <div class="col-12 col-md-4">
              <form-control-text
                name="title"
                label="Title"
                defaultValue={this.representativeDefaultValue?.title}
                errorText={this.errors.title}
                inputHandler={this.inputHandler}
                helpText="Role at your business, e.g. President, CEO, Treasurer."
              />
            </div>
            <div class="col-12 col-md-6">
              <form-control-text
                name="email"
                label="Email Address"
                defaultValue={this.representativeDefaultValue?.email}
                errorText={this.errors.email}
                inputHandler={this.inputHandler}
              />
            </div>
            <div class="col-12 col-md-6">
              <form-control-number-masked
                name="phone"
                label="Phone Number"
                defaultValue={this.representativeDefaultValue?.phone}
                errorText={this.errors.phone}
                inputHandler={this.inputHandler}
                mask={PHONE_MASKS.US}
              />
            </div>
            <div class="col-12 col-md-4">
              <form-control-date
                name="dob_full"
                label="Birth Date"
                defaultValue={this.representativeDefaultValue?.dob_full}
                errorText={this.errors.dob_full}
                inputHandler={this.inputHandler}
                onFormControlInput={(e) => updateDateOfBirthFormValues(e, this.formController)}
                helpText="Must be 18 or older."
              />
            </div>
            <div class="col-12 col-md-8">
              <form-control-number-masked
                name="identification_number"
                label="SSN"
                defaultValue={this.representativeDefaultValue?.identification_number}
                errorText={this.errors.identification_number}
                inputHandler={this.inputHandler}
                mask={SSN_MASK}
                helpText="Enter your full Social Security Number. It is required for Federal OFAC check."
              />
            </div>
            <div class="col-12">
              <justifi-identity-address-form
                errors={this.errors.address}
                defaultValues={this.representativeDefaultValue?.address}
                handleFormUpdate={this.onAddressFormUpdate}
              />
            </div>
          </div>
        </fieldset>
      </form>
    );
  }
};
