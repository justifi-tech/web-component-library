import { ComponentErrorCodes, ComponentErrorSeverity } from './ComponentError';
import {
  BusinessFormClickActions,
  BusinessFormStep,
  DisputeManagementClickActions,
  DisputeResponseFormStep,
  TableClickActions,
} from './EventActions';

export interface ComponentClickEvent {
  name:
    | BusinessFormClickActions
    | DisputeManagementClickActions
    | TableClickActions;
  data?: any;
}

export interface ComponentSubmitEvent {
  response: any;
  metadata?: any;
}

export interface ComponentFormStepCompleteEvent {
  formStep: BusinessFormStep | DisputeResponseFormStep;
  response?: any;
  metadata?: any;
}

export interface ComponentErrorEvent {
  errorCode: ComponentErrorCodes;
  message: string;
  severity?: ComponentErrorSeverity;
  data?: any;
}

export interface RecordClickEvent {
  id: string;
  type: 'account' | 'payment' | 'metadata';
}
