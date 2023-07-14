import { Component, Host, h, Prop, State, Watch } from '@stencil/core';

@Component({
  tag: 'justifi-business-representative',
  styleUrl: 'business-representative.scss',
  shadow: true,
})
export class BusinessRepresentative {
  @State() representative: any = {};
  @Prop() defaultValues?: any;
  @Prop() errors?: any = {};
  @Prop() onFormUpdate: (values: any) => void;

  @Watch('representative')
  handleRepresentativeChange(newValues: any) {
    this.onFormUpdate(newValues);
  };

  onChange(field) {
    this.representative = { ...this.representative, ...field };
  };

  onAddressFormUpdate(values) {
    this.representative.address = values;
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <fieldset>
          <legend>Representative</legend>
          <div class="row gx-2 gy-2">
            <div class="col-8">
              <form-control-text
                name="name"
                label="Full Name"
                defaultValue={this.defaultValues?.name}
                error={this.errors?.name}
                onChange={(event: any) => this.onChange(event)} />
            </div>

            <div class="col-4">
              <form-control-select
                name="title"
                label="Prefix"
                defaultValue={this.defaultValues?.title}
                options={[{ label: 'Select Prefix', value: '' }, { label: 'Mrs.', value: 'Mrs.' }]}
                error={this.errors?.title}
                onChange={(event: any) => this.onChange(event)} />
            </div>

            <div class="col-12">
              <form-control-text
                name="email"
                label="Email Address"
                defaultValue={this.defaultValues?.email}
                error={this.errors?.email}
                onChange={(event: any) => this.onChange(event)} />
            </div>

            <div class="col-12">
              <form-control-text
                name="phone"
                label="Phone Number"
                defaultValue={this.defaultValues?.phone}
                error={this.errors?.phone}
                onChange={(event: any) => this.onChange(event)} />
            </div>

            <div class="col-12">
              <label part="label" class="form-label">Birth Date</label>
            </div>

            <div class="col-4">
              <form-control-text
                name="dob_day"
                label="Day"
                defaultValue={this.defaultValues?.dob_day}
                error={this.errors?.dob_day}
                onChange={(event: any) => this.onChange(event)} />
            </div>

            <div class="col-4">
              <form-control-text
                name="dob_month"
                label="Month"
                defaultValue={this.defaultValues?.dob_month}
                error={this.errors?.dob_month}
                onChange={(event: any) => this.onChange(event)} />
            </div>

            <div class="col-4">
              <form-control-text
                name="dob_year"
                label="Year"
                defaultValue={this.defaultValues?.dob_year}
                error={this.errors?.dob_year}
                onChange={(event: any) => this.onChange(event)} />
            </div>

            <div class="col-12">
              <form-control-text
                name="identification_number"
                label="EIN/SSN"
                defaultValue={this.defaultValues?.identification_number}
                error={this.errors?.identification_number}
                onChange={(event: any) => this.onChange(event)} />
            </div>

            <div class="col-12">
              <justifi-business-address-form
                onFormUpdate={(values: any) => this.onAddressFormUpdate(values)}
                errors={this.errors?.address}
                defaultValues={this.defaultValues?.address} />
            </div>
          </div>
        </fieldset>
      </Host >
    );
  }

}
