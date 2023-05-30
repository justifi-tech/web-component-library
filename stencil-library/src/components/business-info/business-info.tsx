import { Component, Host, h } from '@stencil/core';

/**
 * @exportedPart label: Label for inputs
 * @exportedPart input: The input fields
 * @exportedPart input-invalid: Invalid state for inputs
 */
@Component({
  tag: 'justifi-business-info',
  styleUrl: 'business-info.scss',
  shadow: true,
})
export class BusinessInfo {
  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <fieldset>
          <div class="row gy-3">
            <div class="col-12">
              <justifi-business-representative></justifi-business-representative>
            </div>
          </div>
        </fieldset>
      </Host>
    );
  }

}
