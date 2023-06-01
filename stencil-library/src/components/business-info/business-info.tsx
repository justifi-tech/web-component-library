import { Component, Host, h, Prop } from '@stencil/core';
import { Api, IApiResponseCollection } from '../../api';

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
  @Prop() authToken: string;
  @Prop() accountId: string;
  private businessRepresentativeFormRef?: HTMLJustifiBusinessRepresentativeElement;

  async submit(event) {
    event.preventDefault();
    const businessRepresentativeForm = await this.businessRepresentativeFormRef.getForm();
    this.sendData(businessRepresentativeForm);
  };

  fetchData(): void {
    // fetch data and pre-fill form
  };

  sendData(data): void {
    // const accountId = this.accountId;
    const endpoint = `/entities/business`;
    Api(this.authToken).patch(endpoint, data)
      .then((response: IApiResponseCollection<any>) => {
        console.log(response);
      });
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
