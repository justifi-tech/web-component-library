import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'billing-form',
  styleUrl: 'billing-form.css',
  shadow: true,
})
export class BillingForm {

  render() {
    return (
      <Host>
        <fieldset>
          <label>Street Address</label>
          <input name="address_line1" type="text" />
          <br />
          <label>Apartment, Suite, etc. (optional)</label>
          <input name="address_line2" type="text" />
          <br />
          <label>City</label>
          <input name="address_city" type="text" />
          <br />
          <label>State</label>
          <input name="address_state" type="text" />
          <br />
          <label>ZIP</label>
          <input name="address_postal_code" type="text" />
        </fieldset>
      </Host>
    );
  }

}
