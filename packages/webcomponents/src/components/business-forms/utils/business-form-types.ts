export const RegExZip = /^\d{5}/;

export enum BusinessFormServerErrors {
  fetchData = 'Error retrieving business data',
  patchData = 'Error updating business data'
}

export enum BusinessFormClickEvents {
  nextStep = 'nextStep',
  previousStep = 'previousStep',
  submit = 'submit'
}

export interface BusinessAddressFormFields {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}
