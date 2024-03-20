import { Component, Host, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import { IBusiness } from '../../../../api/Business';
import { BusinessFormServerErrorEvent, BusinessFormServerErrors } from '../../utils/business-form-types';
import { Api, IApiResponse } from '../../../../api';
import { config } from '../../../../../config';

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
  @State() ownerIds: string[] = [];
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
      this.ownerIds = response.data.owners.map((owner) => owner.id);
    } catch (error) {
      this.serverError.emit({ data: error, message: BusinessFormServerErrors.fetchData });
    } finally {
      this.formLoading.emit(false);
    }
  }

  componentWillLoad() {
    const missingAuthTokenMessage = 'Warning: Missing auth-token. The form will not be functional without it.';
    const missingBusinessIdMessage = 'Warning: Missing business-id. The form requires an existing business-id to function.';
    if (!this.authToken) console.error(missingAuthTokenMessage);
    if (!this.businessId) console.error(missingBusinessIdMessage);

    this.api = Api(this.authToken, config.proxyApiOrigin);
    this.fetchData();
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

  render() {
      
    return (
      <Host exportparts="label,input,input-invalid">
       {this.ownerIds.map((ownerId) => {
          return (
            <justifi-owner-form 
              authToken={this.authToken} 
              businessId={this.businessId} 
              ownerId={ownerId}
            />
          );
       })}
      </Host>
    );
  }
}
