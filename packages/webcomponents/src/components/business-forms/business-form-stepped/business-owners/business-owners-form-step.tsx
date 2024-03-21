import { Component, Host, h, Prop, State, Event, EventEmitter, Method } from '@stencil/core';
import { IBusiness } from '../../../../api/Business';
import { BusinessFormServerErrorEvent, BusinessFormServerErrors } from '../../utils/business-form-types';
import { Api, IApiResponse } from '../../../../api';
import { config } from '../../../../../config';
import { Owner } from '../../../../api/Identity';

/**
 * @exportedPart label: Label for inputs
 * @exportedPart input: The input fields
 * @exportedPart input-invalid: Invalid state for inputfs
 */
@Component({
  tag: 'justifi-business-owners-form-step',
  styleUrl: 'business-owners-form-step.scss',
  shadow: false,
})
export class BusinessOwnersFormStep {
  @Prop() authToken: string;
  @Prop() businessId: string;
  @State() owners: Owner[] = [];
  @Event() formLoading: EventEmitter<boolean>;
  @Event() serverError: EventEmitter<BusinessFormServerErrorEvent>;

  private api: any;

  get businessEndpoint() {
    return `entities/business/${this.businessId}`
  }

  private fetchData = async () => {
    this.formLoading.emit(true);
    try {
      const response: IApiResponse<IBusiness> = await this.api.get(this.businessEndpoint);
      this.owners = response.data.owners;
    } catch (error) {
      this.serverError.emit({ data: error, message: BusinessFormServerErrors.fetchData });
    } finally {
      this.formLoading.emit(false);
    }
  }


  private ownerRef1: any;
  private ownerRef2: any;
  private ownerRef3: any;
  // private ownerRef4: any;
  private refs = [];

  componentWillLoad() {
    const missingAuthTokenMessage = 'Warning: Missing auth-token. The form will not be functional without it.';
    const missingBusinessIdMessage = 'Warning: Missing business-id. The form requires an existing business-id to function.';
    if (!this.authToken) console.error(missingAuthTokenMessage);
    if (!this.businessId) console.error(missingBusinessIdMessage);

    this.api = Api(this.authToken, config.proxyApiOrigin);
    this.fetchData();
    this.refs = [this.ownerRef1, this.ownerRef2, this.ownerRef3];
  }

  // addOwner(event: MouseEvent): void {
  //   event.preventDefault();

  //   this.formController.setValues({
  //     ...this.formController.values.getValue(),
  //     owners: [...this.owners, { ...new BusinessOwner() }],
  //   });
  // }

  // removeOwner(event: MouseEvent, index: number): void {
  //   event.preventDefault();
  //   this.formController.setValues({
  //     ...this.formController.values.getValue(),
  //     owners: this.owners.filter((_owner, i) => i !== index),
  //   });
  // }

  private submitAll = async () => {
    const refSubmissions = this.refs.map(ref => ref.submit());
    Promise.all(refSubmissions)
  };


  @Method()
  async validateAndSubmit({ onSuccess }) {
    const refValidations = this.refs.map(ref => ref.validate());
    Promise.all(refValidations)
      .then(values => {
        if (values.every(value => value === true)) {
          this.submitAll();
          onSuccess();
        }
      });
  };

  render() {
      
    return (
      <Host exportparts="label,input,input-invalid">
        <div class='col-12'>
          {this.owners.map((owner, index) => {
            return (
              <justifi-owner-form 
                authToken={this.authToken} 
                businessId={this.businessId} 
                ownerId={owner.id}
                ref={(ref) => this.refs[index] = ref}
              />
            );
          })}
        </div>
      </Host>
    );
  }
}
