import { Component, Host, h, Prop } from '@stencil/core';
import FormState from '../../form/form';

@Component({
  tag: 'justifi-business-representative',
  styleUrl: 'business-representative.scss',
  shadow: true,
})
export class BusinessRepresentative {
  @Prop() form: FormState;

  // private toggleIsOwner() {
  //   this.representativeFields.is_owner = !this.representativeFields.is_owner
  // }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <fieldset>
          <legend>Representative</legend>
          <div class="row gx-2 gy-2">
            <div class="col-8">
              <form-control-text
                name="representative.name"
                label="Full Name"
                defaultValue={this.form.defaultValues?.representative?.name}
                error={this.form.errors['representative.name']} />
            </div>

            <div class="col-4">
              <form-control-select
                name="representative.title"
                label="Prefix"
                defaultValue={this.form.defaultValues?.representative?.title}
                options={[{ label: 'Select Prefix', value: '' }, { label: 'Mrs.', value: 'Mrs.' }]}
                error={this.form.errors['representative.title']} />
            </div>

            <div class="col-12">
              <form-control-text
                name="representative.email"
                label="Email Address"
                defaultValue={this.form.defaultValues?.representative?.email}
                error={this.form.errors['representative.email']} />
            </div>

            <div class="col-12">
              <form-control-text
                name="representative.phone"
                label="Phone Number"
                defaultValue={this.form.defaultValues?.representative?.phone}
                error={this.form.errors['representative.phone']} />
            </div>

            <div class="col-12">
              <label part="label" class="form-label">Birth Date</label>
            </div>

            <div class="col-4">
              <form-control-text
                name="representative.dob_day"
                label="Day"
                defaultValue={this.form.defaultValues?.representative?.dob_day}
                error={this.form.errors['representative.dob_day']} />
            </div>

            <div class="col-4">
              <form-control-text
                name="representative.dob_month"
                label="Month"
                defaultValue={this.form.defaultValues?.representative?.dob_month}
                error={this.form.errors['representative.dob_month']} />
            </div>

            <div class="col-4">
              <form-control-text
                name="representative.dob_year"
                label="Year"
                defaultValue={this.form.defaultValues?.representative?.dob_year}
                error={this.form.errors['representative.dob_year']} />
            </div>

            <div class="col-12">
              <form-control-text
                name="representative.identification_number"
                label="EIN/SSN"
                defaultValue={this.form.defaultValues?.representative?.identification_number}
                error={this.form.errors['representative.identification_number']} />
            </div>

            <div class="col-12">
              <justifi-business-address-form form={this.form} subFormName='representative.address' />
            </div>
          </div>
        </fieldset>
      </Host >
    );
  }

}
