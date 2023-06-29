import { Component, Host, h, Prop } from '@stencil/core';
import FormController from '../../form/form-controller';


@Component({
  tag: 'justifi-business-representative',
  styleUrl: 'business-representative.scss',
  shadow: true,
})
export class BusinessRepresentative {
  @Prop() form: FormController;

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
                {...this.form.register('representative.name')}
                label="Full Name"
                error={this.form.errors?.representative?.name}
              />
            </div>

            <div class="col-4">
              <form-control-select
                {...this.form.register('representative.title')}
                label="Prefix"
                options={[{ label: 'Mrs.', value: 'Mrs.' }]}
                error={this.form?.errors?.representative?.title} />
            </div>

            <div class="col-12">
              <form-control-text
                {...this.form.register('representative.name')}
                label="Email"
                error={this.form?.errors?.representative?.email} />
            </div>

            <div class="col-12">
              <form-control-text
                {...this.form.register('representative.phone')}
                label="Phone"
                error={this.form?.errors?.representative?.phone} />
            </div>

            <div class="col-12">
              <label part="label" class="form-label">Birth Date</label>
            </div>

            <div class="col-4">
              <form-control-text
                {...this.form.register('representative.dob_day')}
                label="Day"
                error={this.form?.errors?.representative?.dob_day} />
            </div>

            <div class="col-4">
              <form-control-text
                {...this.form.register('representative.dob_month')}
                label="Month"
                error={this.form?.errors?.representative?.dob_month} />
            </div>

            <div class="col-4">
              <form-control-text
                {...this.form.register('representative.do_year')}
                label="Year"
                error={this.form?.errors?.representative?.dob_year} />
            </div>

            <div class="col-12">
              <form-control-text
                name="identification_number"
                label="EIN/SSN"
                error={this.form?.errors?.representative?.identification_number} />
            </div>

            {/* <div class="col-12">
              <div class="form-check">
                <input
                  type="checkbox"
                  id="is_owner_checkbox"
                  class="form-check-input"
                  onChange={() => this.toggleIsOwner()} />
                <label class="form-check-label" htmlFor="is_owner_checkbox">
                  Is this an owner?
                </label>
              </div>
            </div> */}

            <div class="col-12">
              <justifi-business-address />
            </div>
          </div>
        </fieldset>
      </Host >
    );
  }

}
