import { Component, h, Prop, Host } from '@stencil/core';
import { CountryCode } from '../../../../utils/country-codes';
import { numberOnlyHandler } from '../../../../ui-components/form/utils';
import { countryLabels, countryOptions } from '../../utils/country-config';

@Component({
	tag: 'justifi-form-address-fields'
})
export class FormAddressFields {
	@Prop() country: CountryCode = CountryCode.USA;
	@Prop() errors: any;
	@Prop() defaultValues: any;
	@Prop() inputHandler: (name: string, value: string) => void;

	render() {
		const labels = countryLabels[this.country];
		const options = countryOptions[this.country];

		return (
			<Host>
				<div class="row gy-3">
					<div class="col-12">
						<form-control-text
							name="line1"
							label="Street Address"
							inputHandler={this.inputHandler}
							defaultValue={this.defaultValues?.line1}
							errorText={this.errors?.line1}
							helpText="No PO Boxes."
						/>
					</div>
					<div class="col-12">
						<form-control-text
							name="line2"
							label="Address Line 2 (optional)"
							inputHandler={this.inputHandler}
							defaultValue={this.defaultValues?.line2}
							errorText={this.errors?.line2}
						/>
					</div>
					<div class="col-12">
						<form-control-text
							name="city"
							label="City"
							inputHandler={this.inputHandler}
							defaultValue={this.defaultValues?.city}
							errorText={this.errors?.city}
						/>
					</div>
					<div class="col-12">
						<form-control-select
							name="state"
							label={labels.stateLabel}
							options={options.stateOptions}
							inputHandler={this.inputHandler}
							defaultValue={this.defaultValues?.state}
							errorText={this.errors?.state}
						/>
					</div>
					<div class="col-12">
						<form-control-text
							name="postal_code"
							label={labels.postalLabel}
							inputHandler={this.inputHandler}
							defaultValue={this.defaultValues?.postal_code}
							errorText={this.errors?.postal_code}
							maxLength={this.country === CountryCode.USA ? 5 : 7}
							keyDownHandler={this.country === CountryCode.USA ? numberOnlyHandler : undefined}
						/>
					</div>
				</div>
			</Host>
		);
	}
}


