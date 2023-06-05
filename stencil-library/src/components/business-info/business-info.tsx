import { Component, Host, h, Prop, State } from '@stencil/core';
import { Api, IApiResponseCollection } from '../../api';


/**
 * @exportedPart label: Label for inputs
 * @exportedPart input: The input fields
 * @exportedPart input-invalid: Invalid state for inputfs
 */
@Component({
  tag: 'justifi-business-info',
  styleUrl: 'business-info.scss',
  shadow: true,
})
export class BusinessInfo {
  @Prop() authToken: string;
  @Prop() businessId?: string;
  @State() businessInfo: any;

  private endpoint: string = '/entities/business';
  private businessRepresentativeFormRef?: HTMLJustifiBusinessRepresentativeElement;

  async submit(event) {
    event.preventDefault();
    const businessRepresentativeForm = await this.businessRepresentativeFormRef.getForm();
    console.log('businessRepresentativeForm', businessRepresentativeForm);
  };

  componentDidMount() {
    if (this.businessId) {
      this.fetchData();
    }
  }

  async fetchData(): Promise<void> {
    // fetch data and pre-fill form
    const businessInfo = await Api(this.authToken).get(`${this.endpoint}/${this.businessId}`);
    console.log(businessInfo);
  };

  async sendData(data): Promise<void> {
    Api(this.authToken).patch(this.endpoint, data)
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
                representative={this.businessInfo?.representative}
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
