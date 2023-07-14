import { Component, Host, h, Prop, State, Event, EventEmitter, Watch } from '@stencil/core';

@Component({
  tag: 'justifi-business-representative',
  styleUrl: 'business-representative.scss',
  shadow: true,
})
export class BusinessRepresentative {
  @Prop() defaultValues: any;
  @Prop() errors: any = {};
  @State() representative: any = {};
  @Event() updateFormValues: EventEmitter<any>;

  @Watch('representative')
  handleRepresentativeChange(newValue: any) {
    this.updateFormValues.emit({ representative: newValue });
  };

  onChange(field) {
    this.representative = { ...this.representative, ...field };
  };

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
                defaultValue={this.defaultValues?.representative?.name}
                error={this.errors['representative.name']}
                onChange={(event: any) => this.onChange(event)} />
            </div>

            <div class="col-4">
              <form-control-select
                name="title"
                label="Prefix"
                defaultValue={this.defaultValues?.representative?.title}
                options={[{ label: 'Select Prefix', value: '' }, { label: 'Mrs.', value: 'Mrs.' }]}
                error={this.errors['representative.title']}
                onChange={(event: any) => this.onChange(event)} />
            </div>

            <div class="col-12">
              <form-control-text
                name="email"
                label="Email Address"
                defaultValue={this.defaultValues?.representative?.email}
                error={this.errors['representative.email']}
                onChange={(event: any) => this.onChange(event)} />
            </div>

            <div class="col-12">
              <form-control-text
                name="phone"
                label="Phone Number"
                defaultValue={this.defaultValues?.representative?.phone}
                error={this.errors['representative.phone']}
                onChange={(event: any) => this.onChange(event)} />
            </div>

            <div class="col-12">
              <label part="label" class="form-label">Birth Date</label>
            </div>

            <div class="col-4">
              <form-control-text
                name="dob_day"
                label="Day"
                defaultValue={this.defaultValues?.representative?.dob_day}
                error={this.errors['representative.dob_day']}
                onChange={(event: any) => this.onChange(event)} />
            </div>

            <div class="col-4">
              <form-control-text
                name="dob_month"
                label="Month"
                defaultValue={this.defaultValues?.representative?.dob_month}
                error={this.errors['representative.dob_month']}
                onChange={(event: any) => this.onChange(event)} />
            </div>

            <div class="col-4">
              <form-control-text
                name="dob_year"
                label="Year"
                defaultValue={this.defaultValues?.representative?.dob_year}
                error={this.errors['representative.dob_year']}
                onChange={(event: any) => this.onChange(event)} />
            </div>

            <div class="col-12">
              <form-control-text
                name="identification_number"
                label="EIN/SSN"
                defaultValue={this.defaultValues?.representative?.identification_number}
                error={this.errors['representative.identification_number']}
                onChange={(event: any) => this.onChange(event)} />
            </div>

            {/* <div class="col-12">
              <justifi-business-address-form form={this.form} subFormName='representative.address' />
            </div> */}
          </div>
        </fieldset>
      </Host >
    );
  }

}
