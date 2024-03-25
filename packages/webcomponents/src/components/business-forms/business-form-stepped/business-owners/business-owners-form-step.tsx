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
  @State() refs = [];
  @Event() formLoading: EventEmitter<boolean>;
  @Event() serverError: EventEmitter<BusinessFormServerErrorEvent>;

  constructor() {
    this.removeOwner = this.removeOwner.bind(this);
    this.submitAll = this.submitAll.bind(this);
    this.initializeRefs = this.initializeRefs.bind(this);
  }

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
      // this.initializeRefs();
    }
  }

  
  
  private initializeRefs() {
    console.log('fired')
    const ownerRefs = [this.ownerRef1, this.ownerRef2, this.ownerRef3, this.ownerRef4];
    this.refs = ownerRefs.slice(this.owners.length);
    console.log('this.refs', this.refs);
    console.log('this.owners', this.owners);
  }

  private ownerRef1: any;
  private ownerRef2: any;
  private ownerRef3: any;
  private ownerRef4: any;

  componentWillLoad() {
    const missingAuthTokenMessage = 'Warning: Missing auth-token. The form will not be functional without it.';
    const missingBusinessIdMessage = 'Warning: Missing business-id. The form requires an existing business-id to function.';
    if (!this.authToken) console.error(missingAuthTokenMessage);
    if (!this.businessId) console.error(missingBusinessIdMessage);

    this.api = Api(this.authToken, config.proxyApiOrigin);
    this.fetchData();
  }

  // @Watch('owners')
  // watchOwners() {
  //   this.initializeRefs();
  // }

  // addOwner(event: MouseEvent): void {
  //   event.preventDefault();

  //   this.formController.setValues({
  //     ...this.formController.values.getValue(),
  //     owners: [...this.owners, { ...new BusinessOwner() }],
  //   });
  // }

  private removeOwner = (id: string) => {
    const ownerIndex = this.owners.findIndex(owner => owner.id === id);
    if (ownerIndex !== -1) {
      this.owners = this.owners.filter((_, index) => index !== ownerIndex);
      this.refs = this.refs.filter((_, index) => index !== ownerIndex);
    }
    console.log('this.owners', this.owners);
    console.log('this.refs', this.refs);
  };

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
            console.log(owner, index)
            return (
              <justifi-owner-form 
                key={owner.id}
                authToken={this.authToken} 
                businessId={this.businessId} 
                ownerId={owner.id}
                removeOwner={this.removeOwner}
                // ref={(ref) => this.refs[index] = ref}
              />
            );
          })}
        </div>
      </Host>
    );
  }
}
