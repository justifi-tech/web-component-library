/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { CreatePaymentMethodResponse } from "./components/payment-method-form/payment-method-responses";
import { BillingFormFields } from "./components/billing-form/billing-form-schema";
import { ValidationError } from "yup";
import { FormController } from "./components/form/form";
import { PaymentMethodTypes } from "./api";
export { CreatePaymentMethodResponse } from "./components/payment-method-form/payment-method-responses";
export { BillingFormFields } from "./components/billing-form/billing-form-schema";
export { ValidationError } from "yup";
export { FormController } from "./components/form/form";
export { PaymentMethodTypes } from "./api";
export namespace Components {
    interface FormControlSelect {
        "defaultValue": string;
        "error": string;
        "inputHandler": (name: string, value: string) => void;
        "label": string;
        "name": any;
        "options": { label: string; value: string }[];
    }
    interface FormControlText {
        "defaultValue": string;
        "error": string;
        "inputHandler": (name: string, value: string) => void;
        "label": string;
        "name": any;
    }
    interface JustifiBankAccountForm {
        /**
          * URL for the rendered iFrame. End-users need not use this.
         */
        "iframeOrigin"?: string;
        /**
          * Manually resizes the iframe to fit the contents of the iframe
         */
        "resize": () => Promise<void>;
        /**
          * Makes a tokenization request to the iframe
         */
        "tokenize": (clientId: string, paymentMethodMetadata: any, account?: string) => Promise<CreatePaymentMethodResponse>;
        /**
          * Runs a validation on the form and shows errors if any
         */
        "validate": () => Promise<any>;
        /**
          * When to trigger validation of the form.
         */
        "validationMode": 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
    }
    /**
     * @exportedPart label: Label for inputs
     * @exportedPart input: The input fields
     * @exportedPart input-invalid: Invalid state for inputs
     */
    interface JustifiBillingForm {
        /**
          * Method for filling the form with provided data
          * @argument fields - The fields to fill the form with
         */
        "fill": (fields: BillingFormFields) => Promise<void>;
        /**
          * Returns the values of the form as an object
          * @returns The values of the form
         */
        "getValues": () => Promise<BillingFormFields>;
        /**
          * (Optional) A label for the form.
         */
        "legend"?: string;
        /**
          * Run validation on the form
         */
        "validate": () => Promise<{ isValid: boolean; }>;
    }
    interface JustifiBusinessAddressForm {
        "defaultValues": any;
        "errors": any;
        "onFormUpdate": (values: any) => void;
    }
    /**
     * @exportedPart label: Label for inputs
     * @exportedPart input: The input fields
     * @exportedPart input-invalid: Invalid state for inputfs
     */
    interface JustifiBusinessForm {
        "authToken": string;
        "businessId"?: string;
    }
    /**
     * @exportedPart label: Label for inputs
     * @exportedPart input: The input fields
     * @exportedPart input-invalid: Invalid state for inputfs
     */
    interface JustifiBusinessGenericInfo {
        "formController": FormController;
    }
    interface JustifiBusinessRepresentative {
        "formController": FormController;
    }
    interface JustifiCardForm {
        /**
          * URL for the rendered iFrame. End-users need not use this.
         */
        "iframeOrigin"?: string;
        /**
          * Manually resizes the iframe to fit the contents of the iframe
         */
        "resize": () => Promise<void>;
        /**
          * Boolean indicating if the Card Form should render in a single line
         */
        "singleLine": boolean;
        /**
          * Makes a tokenization request to the iframe
         */
        "tokenize": (clientId: string, paymentMethodMetadata: any, account?: string) => Promise<CreatePaymentMethodResponse>;
        /**
          * Runs a validation on the form and shows errors if any
         */
        "validate": () => Promise<{ isValid: boolean; }>;
        /**
          * When to trigger validation of the form.
         */
        "validationMode": 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
    }
    interface JustifiPaymentForm {
        "accountId"?: string;
        "bankAccount"?: boolean;
        "card"?: boolean;
        "clientId": string;
        "email"?: string;
        "enableSubmitButton": () => Promise<void>;
        "fillBillingForm": (fields: BillingFormFields) => Promise<void>;
        "iframeOrigin"?: string;
        "loadFontsOnParent": () => Promise<any>;
        "submitButtonText"?: string;
    }
    interface JustifiPaymentMethodForm {
        "iframeOrigin"?: string;
        "paymentMethodFormType": 'card' | 'bankAccount';
        "paymentMethodFormValidationMode": 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
        "resize": () => Promise<any>;
        "singleLine": boolean;
        "tokenize": (clientId: string, paymentMethodMetadata: any, account?: string) => Promise<CreatePaymentMethodResponse>;
        "validate": () => Promise<any>;
    }
    interface JustifiPaymentMethodSelector {
        "paymentMethodTypes": PaymentMethodTypes[];
        "selectedPaymentMethodType": PaymentMethodTypes;
    }
    /**
     * @exportedPart table-head: Table head
     * @exportedPart table-head-row: Head row
     * @exportedPart table-head-cell: Individual head cell
     * @exportedPart table-body: Body of the table
     * @exportedPart table-row: Row of the table
     * @exportedPart table-cell: Individual cell of the table
     * @exportedPart loading-state-cell: Row for loading state
     * @exportedPart loading-state-spinner: Spinner element for loading state
     * @exportedPart error-state: Row for Error state
     * @exportedPart empty-state: Row for Emtpy state
     * @exportedPart pagination-bar: Pagination bar
     * @exportedPart arrow: Both paging buttons
     * @exportedPart arrow-left: Previous page button
     * @exportedPart arrow-right: Next page button
     * @exportedPart arrow-disabled: Disabled state for paging buttons
     */
    interface JustifiPaymentsList {
        "accountId": string;
        "authToken": string;
    }
    /**
     * @exportedPart table-head: Table head
     * @exportedPart table-head-row: Head row
     * @exportedPart table-head-cell: Individual head cell
     * @exportedPart table-body: Body of the table
     * @exportedPart table-row: Row of the table
     * @exportedPart table-cell: Individual cell of the table
     * @exportedPart loading-state-cell: Row for loading state
     * @exportedPart loading-state-spinner: Spinner element for loading state
     * @exportedPart error-state: Row for Error state
     * @exportedPart empty-state: Row for Emtpy state
     * @exportedPart pagination-bar: Pagination bar
     * @exportedPart arrow: Both paging buttons
     * @exportedPart arrow-left: Previous page button
     * @exportedPart arrow-right: Next page button
     * @exportedPart arrow-disabled: Disabled state for paging buttons
     */
    interface JustifiPayoutsList {
        "accountId": string;
        "authToken": string;
    }
    interface SelectInput {
        "defaultValue": string;
        "error": string;
        "label": string;
        "name": string;
        "options": { label: string; value: string }[];
    }
    interface TextInput {
        "defaultValue": string;
        "error": string;
        "label": string;
        "name": string;
    }
}
export interface FormControlSelectCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLFormControlSelectElement;
}
export interface FormControlTextCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLFormControlTextElement;
}
export interface JustifiBankAccountFormCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLJustifiBankAccountFormElement;
}
export interface JustifiCardFormCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLJustifiCardFormElement;
}
export interface JustifiPaymentFormCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLJustifiPaymentFormElement;
}
export interface JustifiPaymentMethodFormCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLJustifiPaymentMethodFormElement;
}
export interface JustifiPaymentMethodSelectorCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLJustifiPaymentMethodSelectorElement;
}
export interface SelectInputCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLSelectInputElement;
}
export interface TextInputCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTextInputElement;
}
declare global {
    interface HTMLFormControlSelectElement extends Components.FormControlSelect, HTMLStencilElement {
    }
    var HTMLFormControlSelectElement: {
        prototype: HTMLFormControlSelectElement;
        new (): HTMLFormControlSelectElement;
    };
    interface HTMLFormControlTextElement extends Components.FormControlText, HTMLStencilElement {
    }
    var HTMLFormControlTextElement: {
        prototype: HTMLFormControlTextElement;
        new (): HTMLFormControlTextElement;
    };
    interface HTMLJustifiBankAccountFormElement extends Components.JustifiBankAccountForm, HTMLStencilElement {
    }
    var HTMLJustifiBankAccountFormElement: {
        prototype: HTMLJustifiBankAccountFormElement;
        new (): HTMLJustifiBankAccountFormElement;
    };
    /**
     * @exportedPart label: Label for inputs
     * @exportedPart input: The input fields
     * @exportedPart input-invalid: Invalid state for inputs
     */
    interface HTMLJustifiBillingFormElement extends Components.JustifiBillingForm, HTMLStencilElement {
    }
    var HTMLJustifiBillingFormElement: {
        prototype: HTMLJustifiBillingFormElement;
        new (): HTMLJustifiBillingFormElement;
    };
    interface HTMLJustifiBusinessAddressFormElement extends Components.JustifiBusinessAddressForm, HTMLStencilElement {
    }
    var HTMLJustifiBusinessAddressFormElement: {
        prototype: HTMLJustifiBusinessAddressFormElement;
        new (): HTMLJustifiBusinessAddressFormElement;
    };
    /**
     * @exportedPart label: Label for inputs
     * @exportedPart input: The input fields
     * @exportedPart input-invalid: Invalid state for inputfs
     */
    interface HTMLJustifiBusinessFormElement extends Components.JustifiBusinessForm, HTMLStencilElement {
    }
    var HTMLJustifiBusinessFormElement: {
        prototype: HTMLJustifiBusinessFormElement;
        new (): HTMLJustifiBusinessFormElement;
    };
    /**
     * @exportedPart label: Label for inputs
     * @exportedPart input: The input fields
     * @exportedPart input-invalid: Invalid state for inputfs
     */
    interface HTMLJustifiBusinessGenericInfoElement extends Components.JustifiBusinessGenericInfo, HTMLStencilElement {
    }
    var HTMLJustifiBusinessGenericInfoElement: {
        prototype: HTMLJustifiBusinessGenericInfoElement;
        new (): HTMLJustifiBusinessGenericInfoElement;
    };
    interface HTMLJustifiBusinessRepresentativeElement extends Components.JustifiBusinessRepresentative, HTMLStencilElement {
    }
    var HTMLJustifiBusinessRepresentativeElement: {
        prototype: HTMLJustifiBusinessRepresentativeElement;
        new (): HTMLJustifiBusinessRepresentativeElement;
    };
    interface HTMLJustifiCardFormElement extends Components.JustifiCardForm, HTMLStencilElement {
    }
    var HTMLJustifiCardFormElement: {
        prototype: HTMLJustifiCardFormElement;
        new (): HTMLJustifiCardFormElement;
    };
    interface HTMLJustifiPaymentFormElement extends Components.JustifiPaymentForm, HTMLStencilElement {
    }
    var HTMLJustifiPaymentFormElement: {
        prototype: HTMLJustifiPaymentFormElement;
        new (): HTMLJustifiPaymentFormElement;
    };
    interface HTMLJustifiPaymentMethodFormElement extends Components.JustifiPaymentMethodForm, HTMLStencilElement {
    }
    var HTMLJustifiPaymentMethodFormElement: {
        prototype: HTMLJustifiPaymentMethodFormElement;
        new (): HTMLJustifiPaymentMethodFormElement;
    };
    interface HTMLJustifiPaymentMethodSelectorElement extends Components.JustifiPaymentMethodSelector, HTMLStencilElement {
    }
    var HTMLJustifiPaymentMethodSelectorElement: {
        prototype: HTMLJustifiPaymentMethodSelectorElement;
        new (): HTMLJustifiPaymentMethodSelectorElement;
    };
    /**
     * @exportedPart table-head: Table head
     * @exportedPart table-head-row: Head row
     * @exportedPart table-head-cell: Individual head cell
     * @exportedPart table-body: Body of the table
     * @exportedPart table-row: Row of the table
     * @exportedPart table-cell: Individual cell of the table
     * @exportedPart loading-state-cell: Row for loading state
     * @exportedPart loading-state-spinner: Spinner element for loading state
     * @exportedPart error-state: Row for Error state
     * @exportedPart empty-state: Row for Emtpy state
     * @exportedPart pagination-bar: Pagination bar
     * @exportedPart arrow: Both paging buttons
     * @exportedPart arrow-left: Previous page button
     * @exportedPart arrow-right: Next page button
     * @exportedPart arrow-disabled: Disabled state for paging buttons
     */
    interface HTMLJustifiPaymentsListElement extends Components.JustifiPaymentsList, HTMLStencilElement {
    }
    var HTMLJustifiPaymentsListElement: {
        prototype: HTMLJustifiPaymentsListElement;
        new (): HTMLJustifiPaymentsListElement;
    };
    /**
     * @exportedPart table-head: Table head
     * @exportedPart table-head-row: Head row
     * @exportedPart table-head-cell: Individual head cell
     * @exportedPart table-body: Body of the table
     * @exportedPart table-row: Row of the table
     * @exportedPart table-cell: Individual cell of the table
     * @exportedPart loading-state-cell: Row for loading state
     * @exportedPart loading-state-spinner: Spinner element for loading state
     * @exportedPart error-state: Row for Error state
     * @exportedPart empty-state: Row for Emtpy state
     * @exportedPart pagination-bar: Pagination bar
     * @exportedPart arrow: Both paging buttons
     * @exportedPart arrow-left: Previous page button
     * @exportedPart arrow-right: Next page button
     * @exportedPart arrow-disabled: Disabled state for paging buttons
     */
    interface HTMLJustifiPayoutsListElement extends Components.JustifiPayoutsList, HTMLStencilElement {
    }
    var HTMLJustifiPayoutsListElement: {
        prototype: HTMLJustifiPayoutsListElement;
        new (): HTMLJustifiPayoutsListElement;
    };
    interface HTMLSelectInputElement extends Components.SelectInput, HTMLStencilElement {
    }
    var HTMLSelectInputElement: {
        prototype: HTMLSelectInputElement;
        new (): HTMLSelectInputElement;
    };
    interface HTMLTextInputElement extends Components.TextInput, HTMLStencilElement {
    }
    var HTMLTextInputElement: {
        prototype: HTMLTextInputElement;
        new (): HTMLTextInputElement;
    };
    interface HTMLElementTagNameMap {
        "form-control-select": HTMLFormControlSelectElement;
        "form-control-text": HTMLFormControlTextElement;
        "justifi-bank-account-form": HTMLJustifiBankAccountFormElement;
        "justifi-billing-form": HTMLJustifiBillingFormElement;
        "justifi-business-address-form": HTMLJustifiBusinessAddressFormElement;
        "justifi-business-form": HTMLJustifiBusinessFormElement;
        "justifi-business-generic-info": HTMLJustifiBusinessGenericInfoElement;
        "justifi-business-representative": HTMLJustifiBusinessRepresentativeElement;
        "justifi-card-form": HTMLJustifiCardFormElement;
        "justifi-payment-form": HTMLJustifiPaymentFormElement;
        "justifi-payment-method-form": HTMLJustifiPaymentMethodFormElement;
        "justifi-payment-method-selector": HTMLJustifiPaymentMethodSelectorElement;
        "justifi-payments-list": HTMLJustifiPaymentsListElement;
        "justifi-payouts-list": HTMLJustifiPayoutsListElement;
        "select-input": HTMLSelectInputElement;
        "text-input": HTMLTextInputElement;
    }
}
declare namespace LocalJSX {
    interface FormControlSelect {
        "defaultValue"?: string;
        "error"?: string;
        "inputHandler"?: (name: string, value: string) => void;
        "label"?: string;
        "name"?: any;
        "onFormControlBlur"?: (event: FormControlSelectCustomEvent<any>) => void;
        "onFormControlInput"?: (event: FormControlSelectCustomEvent<any>) => void;
        "options"?: { label: string; value: string }[];
    }
    interface FormControlText {
        "defaultValue"?: string;
        "error"?: string;
        "inputHandler"?: (name: string, value: string) => void;
        "label"?: string;
        "name"?: any;
        "onFormControlBlur"?: (event: FormControlTextCustomEvent<any>) => void;
        "onFormControlInput"?: (event: FormControlTextCustomEvent<any>) => void;
    }
    interface JustifiBankAccountForm {
        /**
          * URL for the rendered iFrame. End-users need not use this.
         */
        "iframeOrigin"?: string;
        /**
          * Triggered when iframe has loaded
          * @event justifi-bank-account-form#bankAccountFormReady
         */
        "onBankAccountFormReady"?: (event: JustifiBankAccountFormCustomEvent<any>) => void;
        /**
          * Triggered when the tokenize method is called on the component
          * @event justifi-bank-account-form#bankAccountFormTokenize
         */
        "onBankAccountFormTokenize"?: (event: JustifiBankAccountFormCustomEvent<{ data: any }>) => void;
        /**
          * Triggered when the validate method is called on the component
          * @event justifi-bank-account-form#bankAccountFormValidate
         */
        "onBankAccountFormValidate"?: (event: JustifiBankAccountFormCustomEvent<{ data: { isValid: boolean } }>) => void;
        /**
          * Triggered when iframe has loaded
          * @event justifi-bank-account-form#ready
         */
        "onReady"?: (event: JustifiBankAccountFormCustomEvent<any>) => void;
        /**
          * When to trigger validation of the form.
         */
        "validationMode"?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
    }
    /**
     * @exportedPart label: Label for inputs
     * @exportedPart input: The input fields
     * @exportedPart input-invalid: Invalid state for inputs
     */
    interface JustifiBillingForm {
        /**
          * (Optional) A label for the form.
         */
        "legend"?: string;
    }
    interface JustifiBusinessAddressForm {
        "defaultValues"?: any;
        "errors"?: any;
        "onFormUpdate"?: (values: any) => void;
    }
    /**
     * @exportedPart label: Label for inputs
     * @exportedPart input: The input fields
     * @exportedPart input-invalid: Invalid state for inputfs
     */
    interface JustifiBusinessForm {
        "authToken"?: string;
        "businessId"?: string;
    }
    /**
     * @exportedPart label: Label for inputs
     * @exportedPart input: The input fields
     * @exportedPart input-invalid: Invalid state for inputfs
     */
    interface JustifiBusinessGenericInfo {
        "formController"?: FormController;
    }
    interface JustifiBusinessRepresentative {
        "formController"?: FormController;
    }
    interface JustifiCardForm {
        /**
          * URL for the rendered iFrame. End-users need not use this.
         */
        "iframeOrigin"?: string;
        /**
          * Triggered when iframe has loaded
          * @event justifi-card-form#cardFormReady
         */
        "onCardFormReady"?: (event: JustifiCardFormCustomEvent<any>) => void;
        /**
          * Triggered when the tokenize method is called on the component
          * @event justifi-card-form#cardFormTokenize
         */
        "onCardFormTokenize"?: (event: JustifiCardFormCustomEvent<{ data: any }>) => void;
        /**
          * Triggered when the validate method is called on the component
          * @event justifi-card-form#cardFormTokenize
         */
        "onCardFormValidate"?: (event: JustifiCardFormCustomEvent<{ data: { isValid: boolean } }>) => void;
        /**
          * Triggered when iframe has loaded
          * @event justifi-card-form#ready
         */
        "onReady"?: (event: JustifiCardFormCustomEvent<any>) => void;
        /**
          * Boolean indicating if the Card Form should render in a single line
         */
        "singleLine"?: boolean;
        /**
          * When to trigger validation of the form.
         */
        "validationMode"?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
    }
    interface JustifiPaymentForm {
        "accountId"?: string;
        "bankAccount"?: boolean;
        "card"?: boolean;
        "clientId"?: string;
        "email"?: string;
        "iframeOrigin"?: string;
        "onSubmitted"?: (event: JustifiPaymentFormCustomEvent<CreatePaymentMethodResponse>) => void;
        "submitButtonText"?: string;
    }
    interface JustifiPaymentMethodForm {
        "iframeOrigin"?: string;
        "onPaymentMethodFormReady"?: (event: JustifiPaymentMethodFormCustomEvent<any>) => void;
        "onPaymentMethodFormTokenize"?: (event: JustifiPaymentMethodFormCustomEvent<{ data: any }>) => void;
        "paymentMethodFormType"?: 'card' | 'bankAccount';
        "paymentMethodFormValidationMode"?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
        "singleLine"?: boolean;
    }
    interface JustifiPaymentMethodSelector {
        "onPaymentMethodSelected"?: (event: JustifiPaymentMethodSelectorCustomEvent<any>) => void;
        "paymentMethodTypes"?: PaymentMethodTypes[];
        "selectedPaymentMethodType"?: PaymentMethodTypes;
    }
    /**
     * @exportedPart table-head: Table head
     * @exportedPart table-head-row: Head row
     * @exportedPart table-head-cell: Individual head cell
     * @exportedPart table-body: Body of the table
     * @exportedPart table-row: Row of the table
     * @exportedPart table-cell: Individual cell of the table
     * @exportedPart loading-state-cell: Row for loading state
     * @exportedPart loading-state-spinner: Spinner element for loading state
     * @exportedPart error-state: Row for Error state
     * @exportedPart empty-state: Row for Emtpy state
     * @exportedPart pagination-bar: Pagination bar
     * @exportedPart arrow: Both paging buttons
     * @exportedPart arrow-left: Previous page button
     * @exportedPart arrow-right: Next page button
     * @exportedPart arrow-disabled: Disabled state for paging buttons
     */
    interface JustifiPaymentsList {
        "accountId"?: string;
        "authToken"?: string;
    }
    /**
     * @exportedPart table-head: Table head
     * @exportedPart table-head-row: Head row
     * @exportedPart table-head-cell: Individual head cell
     * @exportedPart table-body: Body of the table
     * @exportedPart table-row: Row of the table
     * @exportedPart table-cell: Individual cell of the table
     * @exportedPart loading-state-cell: Row for loading state
     * @exportedPart loading-state-spinner: Spinner element for loading state
     * @exportedPart error-state: Row for Error state
     * @exportedPart empty-state: Row for Emtpy state
     * @exportedPart pagination-bar: Pagination bar
     * @exportedPart arrow: Both paging buttons
     * @exportedPart arrow-left: Previous page button
     * @exportedPart arrow-right: Next page button
     * @exportedPart arrow-disabled: Disabled state for paging buttons
     */
    interface JustifiPayoutsList {
        "accountId"?: string;
        "authToken"?: string;
    }
    interface SelectInput {
        "defaultValue"?: string;
        "error"?: string;
        "label"?: string;
        "name"?: string;
        "onFieldReceivedInput"?: (event: SelectInputCustomEvent<{ name: string; value: string }>) => void;
        "options"?: { label: string; value: string }[];
    }
    interface TextInput {
        "defaultValue"?: string;
        "error"?: string;
        "label"?: string;
        "name"?: string;
        "onFieldReceivedInput"?: (event: TextInputCustomEvent<{ name: string; value: string }>) => void;
    }
    interface IntrinsicElements {
        "form-control-select": FormControlSelect;
        "form-control-text": FormControlText;
        "justifi-bank-account-form": JustifiBankAccountForm;
        "justifi-billing-form": JustifiBillingForm;
        "justifi-business-address-form": JustifiBusinessAddressForm;
        "justifi-business-form": JustifiBusinessForm;
        "justifi-business-generic-info": JustifiBusinessGenericInfo;
        "justifi-business-representative": JustifiBusinessRepresentative;
        "justifi-card-form": JustifiCardForm;
        "justifi-payment-form": JustifiPaymentForm;
        "justifi-payment-method-form": JustifiPaymentMethodForm;
        "justifi-payment-method-selector": JustifiPaymentMethodSelector;
        "justifi-payments-list": JustifiPaymentsList;
        "justifi-payouts-list": JustifiPayoutsList;
        "select-input": SelectInput;
        "text-input": TextInput;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "form-control-select": LocalJSX.FormControlSelect & JSXBase.HTMLAttributes<HTMLFormControlSelectElement>;
            "form-control-text": LocalJSX.FormControlText & JSXBase.HTMLAttributes<HTMLFormControlTextElement>;
            "justifi-bank-account-form": LocalJSX.JustifiBankAccountForm & JSXBase.HTMLAttributes<HTMLJustifiBankAccountFormElement>;
            /**
             * @exportedPart label: Label for inputs
             * @exportedPart input: The input fields
             * @exportedPart input-invalid: Invalid state for inputs
             */
            "justifi-billing-form": LocalJSX.JustifiBillingForm & JSXBase.HTMLAttributes<HTMLJustifiBillingFormElement>;
            "justifi-business-address-form": LocalJSX.JustifiBusinessAddressForm & JSXBase.HTMLAttributes<HTMLJustifiBusinessAddressFormElement>;
            /**
             * @exportedPart label: Label for inputs
             * @exportedPart input: The input fields
             * @exportedPart input-invalid: Invalid state for inputfs
             */
            "justifi-business-form": LocalJSX.JustifiBusinessForm & JSXBase.HTMLAttributes<HTMLJustifiBusinessFormElement>;
            /**
             * @exportedPart label: Label for inputs
             * @exportedPart input: The input fields
             * @exportedPart input-invalid: Invalid state for inputfs
             */
            "justifi-business-generic-info": LocalJSX.JustifiBusinessGenericInfo & JSXBase.HTMLAttributes<HTMLJustifiBusinessGenericInfoElement>;
            "justifi-business-representative": LocalJSX.JustifiBusinessRepresentative & JSXBase.HTMLAttributes<HTMLJustifiBusinessRepresentativeElement>;
            "justifi-card-form": LocalJSX.JustifiCardForm & JSXBase.HTMLAttributes<HTMLJustifiCardFormElement>;
            "justifi-payment-form": LocalJSX.JustifiPaymentForm & JSXBase.HTMLAttributes<HTMLJustifiPaymentFormElement>;
            "justifi-payment-method-form": LocalJSX.JustifiPaymentMethodForm & JSXBase.HTMLAttributes<HTMLJustifiPaymentMethodFormElement>;
            "justifi-payment-method-selector": LocalJSX.JustifiPaymentMethodSelector & JSXBase.HTMLAttributes<HTMLJustifiPaymentMethodSelectorElement>;
            /**
             * @exportedPart table-head: Table head
             * @exportedPart table-head-row: Head row
             * @exportedPart table-head-cell: Individual head cell
             * @exportedPart table-body: Body of the table
             * @exportedPart table-row: Row of the table
             * @exportedPart table-cell: Individual cell of the table
             * @exportedPart loading-state-cell: Row for loading state
             * @exportedPart loading-state-spinner: Spinner element for loading state
             * @exportedPart error-state: Row for Error state
             * @exportedPart empty-state: Row for Emtpy state
             * @exportedPart pagination-bar: Pagination bar
             * @exportedPart arrow: Both paging buttons
             * @exportedPart arrow-left: Previous page button
             * @exportedPart arrow-right: Next page button
             * @exportedPart arrow-disabled: Disabled state for paging buttons
             */
            "justifi-payments-list": LocalJSX.JustifiPaymentsList & JSXBase.HTMLAttributes<HTMLJustifiPaymentsListElement>;
            /**
             * @exportedPart table-head: Table head
             * @exportedPart table-head-row: Head row
             * @exportedPart table-head-cell: Individual head cell
             * @exportedPart table-body: Body of the table
             * @exportedPart table-row: Row of the table
             * @exportedPart table-cell: Individual cell of the table
             * @exportedPart loading-state-cell: Row for loading state
             * @exportedPart loading-state-spinner: Spinner element for loading state
             * @exportedPart error-state: Row for Error state
             * @exportedPart empty-state: Row for Emtpy state
             * @exportedPart pagination-bar: Pagination bar
             * @exportedPart arrow: Both paging buttons
             * @exportedPart arrow-left: Previous page button
             * @exportedPart arrow-right: Next page button
             * @exportedPart arrow-disabled: Disabled state for paging buttons
             */
            "justifi-payouts-list": LocalJSX.JustifiPayoutsList & JSXBase.HTMLAttributes<HTMLJustifiPayoutsListElement>;
            "select-input": LocalJSX.SelectInput & JSXBase.HTMLAttributes<HTMLSelectInputElement>;
            "text-input": LocalJSX.TextInput & JSXBase.HTMLAttributes<HTMLTextInputElement>;
        }
    }
}
