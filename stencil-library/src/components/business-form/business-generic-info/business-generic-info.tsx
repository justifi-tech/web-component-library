import { Component, Host, h, Prop, Event, EventEmitter, State, Watch } from '@stencil/core';

import { BusinessStructureOptions, BusinessTypeOptions } from '../business-form-schema';

/**
 * @exportedPart label: Label for inputs
 * @exportedPart input: The input fields
 * @exportedPart input-invalid: Invalid state for inputfs
 */
@Component({
  tag: 'justifi-business-generic-info-form',
  // styleUrl: 'business-generic-info-form.scss',
  shadow: true,
})
export class BusinessGenericInfo {
  @Prop() defaultValues: any;
  @Prop() errors: any;
  @State() genericBusinessInfo: any = {};
  @Event() updateFormValues: EventEmitter<any>;

  @Watch('genericBusinessInfo')
  handleGenericBusinessInfoChange(newValue: any) {
    this.updateFormValues.emit(newValue);
  };

  onChange(field) {
    this.genericBusinessInfo = { ...this.genericBusinessInfo, ...field };
  };

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <div class="row gy-3">
          <div class="col-12">
            <form-control-text
              name="legal_name"
              label="Legal Name"
              defaultValue={this.defaultValues?.legal_name}
              error={this.errors?.legal_name}
              onChange={(event: any) => this.onChange(event)} />
          </div>
          <div class="col-12">
            <form-control-text
              name="doing_business_as"
              label="Doing Business As (DBA)"
              defaultValue={this.defaultValues?.doing_business_as}
              error={this.errors?.doing_business_as}
              onChange={(event: any) => this.onChange(event)} />
          </div>
          <div class="col-12">
            <form-control-select
              name="business_type"
              label="Business Type"
              options={BusinessTypeOptions}
              defaultValue={this.defaultValues?.business_type}
              error={this.errors?.business_type}
              onChange={(event: any) => this.onChange(event)} />
          </div>
          <div class="col-12">
            <form-control-select
              name="business_structure"
              label="Business Structure"
              options={BusinessStructureOptions}
              defaultValue={this.defaultValues?.business_structure}
              error={this.errors?.business_structure}
              onChange={(event: any) => this.onChange(event)} />
          </div>
          <div class="col-12">
            <form-control-text
              name="industry"
              label="Industry"
              defaultValue={this.defaultValues?.industry}
              error={this.errors?.business_structure}
              onChange={(event: any) => this.onChange(event)} />
          </div>
          <div class="col-12">
            <form-control-text
              name="website_url"
              label="Website URL"
              defaultValue={this.defaultValues?.website_url}
              error={this.errors?.website_url}
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
        </div>
      </Host>
    );
  }

}
