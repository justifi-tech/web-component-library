import { Component, h, Prop } from '@stencil/core';
import { FormController } from '../../../form/form';
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
          <legend>Representative</legend>
          <hr />
          <div class='row gy-3'>
            <div class='col-12 col-md-8'>
              <form-control-text
                name='name'
                label='Full Name'
                defaultValue={this.representativeDefaultValue?.name}
                errorText={this.errors.name}
                inputHandler={this.inputHandler}
              />
            </div>
            <div class='col-12 col-md-4'>
              <form-control-text
                name='title'
                label='Title'
                defaultValue={this.representativeDefaultValue?.title}
                errorText={this.errors.title}
                inputHandler={this.inputHandler}
              />
            </div>
            <div class='col-12 col-md-6'>
              <form-control-text
                name='email'
                label='Email Address'
                defaultValue={this.representativeDefaultValue?.email}
                errorText={this.errors.email}
                inputHandler={this.inputHandler}
              />
            </div>
            <div class='col-12 col-md-6'>
              <form-control-number-masked
                name='phone'
                label='Phone Number'
                defaultValue={this.representativeDefaultValue?.phone}
                errorText={this.errors.phone}
                inputHandler={this.inputHandler}
                mask={PHONE_MASKS.US}
              />
            </div>
            <div class='col-12 col-md-4'>
              <form-control-date
                name='dob_full'
                label='Birth Date'
                defaultValue={this.representativeDefaultValue?.dob_full}
                errorText={this.errors.dob_full}
                inputHandler={this.inputHandler}
                onFormControlInput={(e) => updateDateOfBirthFormValues(e, this.formController)}
              />
            </div>
            <div class='col-12 col-md-8'>
              <form-control-number-masked
                name='identification_number'
                label='SSN'
                defaultValue={this.representativeDefaultValue?.identification_number}
                errorText={this.errors.identification_number}
                inputHandler={this.inputHandler}
                mask={SSN_MASK}
              />
            </div>
            <div class='col-12'>
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
