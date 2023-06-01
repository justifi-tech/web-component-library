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
  private businessRepresentativeFormRef?: HTMLJustifiBusinessRepresentativeElement;

  async submit(event) {
    event.preventDefault();
    const businessRepresentativeForm = await this.businessRepresentativeFormRef.getForm();
    console.log('businessRepresentativeForm', businessRepresentativeForm);
  };

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <h1>Business Information</h1>
        <form>
          <div class="row gy-3">
            <div class="col-12">
              <justifi-business-representative
                ref={el => this.businessRepresentativeFormRef = el}
              >
              </justifi-business-representative>
            </div>
            <div class="col-12">
              <button
                onClick={(event) => this.submit(event)}
                class="btn btn-primary"
                type="submit">Submit</button>
            </div>
          </div>
        </form>
      </Host>
    );
  }

}
