import { BusinessFormClickActions, BusinessFormStep } from "../components/business-forms/utils/event-types";
import { DisputeManagementClickActions, DisputeResponseFormStep } from "../components/dispute-management/event-types";
import { TableClickActions } from "../ui-components/table/event-types";
import { ComponentErrorCodes, ComponentErrorSeverity } from "./ComponentError";

// click-event

export interface ComponentClickEvent {
  name: BusinessFormClickActions | DisputeManagementClickActions | TableClickActions; // The action that was clicked
  data?: any; // Additional data pertinent to the click event, if any
}

// submit-event

export interface ComponentSubmitEvent {
  response: any;
  metadata?: any;
}

// complete-form-step-event

export interface ComponentFormStepCompleteEvent {
  formStep: BusinessFormStep | DisputeResponseFormStep; // The form step that was completed
  data: any; // The data that was submitted, if any, for the form step
  metadata?: any; // Optional additional info about the form step completion
}

// error-event

export interface ComponentErrorEvent {
  errorCode: ComponentErrorCodes; // A unique code identifying the error
  message: string; // A descriptive message about the error
  severity?: ComponentErrorSeverity; // Optional severity level
  data?: any; // Additional data pertinent to the error (optional)
}
