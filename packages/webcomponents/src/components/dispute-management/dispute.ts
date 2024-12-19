export interface DisputeManagementClickEvents {
  data?: any;
  name: DisputeManagementClickEventNames;
}

export enum DisputeManagementClickEventNames {
  nextStep = 'nextStep',
  previousStep = 'previousStep',
  cancelDispute = 'cancelDispute',
  respondToDispute = 'respondToDispute',
  submit = 'submit',
}

export interface DisputeResponseSubmittedEvent {
  data?: any;
  metadata?: any;
}
