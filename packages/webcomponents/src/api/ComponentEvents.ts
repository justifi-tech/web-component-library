import { EventEmitter } from "@stencil/core";
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
  response?: any; // The data that was submitted, if any, for the form step
  metadata?: any; // Optional additional info about the form step completion
}

// error-event

export interface ComponentErrorEvent {
  errorCode: ComponentErrorCodes; // A unique code identifying the error
  message: string; // A descriptive message about the error
  severity?: ComponentErrorSeverity; // Optional severity level
  data?: any; // Additional data pertinent to the error (optional)
}

// Emits a MISSING_PROPS error naming each falsy prop. Returns true when all props are present.
// `props` keys are the public attribute names, e.g. { 'auth-token': this.authToken }.
export function validateRequiredProps(
  errorEvent: EventEmitter<ComponentErrorEvent>,
  props: Record<string, unknown>,
): boolean {
  const missingProps = Object.entries(props)
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missingProps.length) {
    errorEvent.emit({
      message: `Missing required props: ${missingProps.join(', ')}`,
      errorCode: ComponentErrorCodes.MISSING_PROPS,
      severity: ComponentErrorSeverity.ERROR,
    });
    return false;
  }
  return true;
}
export interface RecordClickEvent {
  id: string;
  type: 'account' | 'payment' | 'metadata';
}