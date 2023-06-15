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
import { IBusinessAddress } from "./components/business-form/business-address/business-address-schema";
import { IBusinessRepresentative } from "./components/business-form/business-representative/business-representative-schema";
import { PaymentMethodTypes } from "./api";
export { CreatePaymentMethodResponse } from "./components/payment-method-form/payment-method-responses";
export { BillingFormFields } from "./components/billing-form/billing-form-schema";
export { ValidationError } from "yup";
export { IBusinessAddress } from "./components/business-form/business-address/business-address-schema";
export { IBusinessRepresentative } from "./components/business-form/business-representative/business-representative-schema";
export { PaymentMethodTypes } from "./api";
export namespace Components {
    interface FormControlSelect {
        "error": string;
        "label": string;
        "name": any;
        "onInput": (e: any) => void;
        "options": { label: string; value: string }[];
    }
    interface FormControlText {
        "error": string;
        "label": string;
        "name": any;
        "onInput": (e: any) => void;
        "value": string;
    }
    interface JustifiBankAccountForm {
        /**
          * URL for the rendered iFrame. End-users need not use this.
         */
        "iframeOrigin"?: string;
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
    interface JustifiBusinessAddress {
        "getForm": () => Promise<{ isValid: boolean; values: IBusinessAddress; }>;
    }
    /**
     * @exportedPart label: Label for inputs
     * @exportedPart input: The input fields
     * @exportedPart input-invalid: Invalid state for inputfs
     */
    interface JustifiBusinessForm {
        "authToken": string;
        "businessId"?: string;
        "submit": (event: any) => Promise<void>;
    }
    interface JustifiBusinessRepresentative {
        "form": FormController;
        "getForm": () => Promise<{ isValid: boolean; values: IBusinessRepresentative; }>;
        "representative"?: IBusinessRepresentative;
    }
    interface JustifiCardForm {
        /**
          * URL for the rendered iFrame. End-users need not use this.
         */
        "iframeOrigin"?: string;
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
        "submitButtonText"?: string;
    }
    interface JustifiPaymentMethodForm {
        "iframeOrigin"?: string;
        "paymentMethodFormType": 'card' | 'bankAccount';
        "paymentMethodFormValidationMode": 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
        "singleLine": boolean;
        "tokenize": (clientId: string, paymentMethodMetadata: any, account?: string) => Promise<CreatePaymentMethodResponse>;
        "validate": () => Promise<any>;
    }
    interface JustifiPaymentMethodSelector {
        "paymentMethodTypes": PaymentMethodTypes[];
        "selectedPaymentMethodType": PaymentMethodTypes;
    }
    interface JustifiPaymentsList {
        "accountId": string;
        "auth": { token?: string };
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
    interface HTMLJustifiBusinessAddressElement extends Components.JustifiBusinessAddress, HTMLStencilElement {
    }
    var HTMLJustifiBusinessAddressElement: {
        prototype: HTMLJustifiBusinessAddressElement;
        new (): HTMLJustifiBusinessAddressElement;
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
    interface HTMLJustifiPaymentsListElement extends Components.JustifiPaymentsList, HTMLStencilElement {
    }
    var HTMLJustifiPaymentsListElement: {
        prototype: HTMLJustifiPaymentsListElement;
        new (): HTMLJustifiPaymentsListElement;
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
        "justifi-business-address": HTMLJustifiBusinessAddressElement;
        "justifi-business-form": HTMLJustifiBusinessFormElement;
        "justifi-business-representative": HTMLJustifiBusinessRepresentativeElement;
        "justifi-card-form": HTMLJustifiCardFormElement;
        "justifi-payment-form": HTMLJustifiPaymentFormElement;
        "justifi-payment-method-form": HTMLJustifiPaymentMethodFormElement;
        "justifi-payment-method-selector": HTMLJustifiPaymentMethodSelectorElement;
        "justifi-payments-list": HTMLJustifiPaymentsListElement;
        "select-input": HTMLSelectInputElement;
        "text-input": HTMLTextInputElement;
    }
}
declare namespace LocalJSX {
    interface FormControlSelect {
        "error"?: string;
        "label"?: string;
        "name"?: any;
        "onInput"?: (e: any) => void;
        "options"?: { label: string; value: string }[];
    }
    interface FormControlText {
        "error"?: string;
        "label"?: string;
        "name"?: any;
        "onInput"?: (e: any) => void;
        "value"?: string;
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
    interface JustifiBusinessAddress {
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
    interface JustifiBusinessRepresentative {
        "form"?: FormController;
        "representative"?: IBusinessRepresentative;
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
    interface JustifiPaymentsList {
        "accountId"?: string;
        "auth"?: { token?: string };
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
        "justifi-business-address": JustifiBusinessAddress;
        "justifi-business-form": JustifiBusinessForm;
        "justifi-business-representative": JustifiBusinessRepresentative;
        "justifi-card-form": JustifiCardForm;
        "justifi-payment-form": JustifiPaymentForm;
        "justifi-payment-method-form": JustifiPaymentMethodForm;
        "justifi-payment-method-selector": JustifiPaymentMethodSelector;
        "justifi-payments-list": JustifiPaymentsList;
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
            "justifi-business-address": LocalJSX.JustifiBusinessAddress & JSXBase.HTMLAttributes<HTMLJustifiBusinessAddressElement>;
            /**
             * @exportedPart label: Label for inputs
             * @exportedPart input: The input fields
             * @exportedPart input-invalid: Invalid state for inputfs
             */
            "justifi-business-form": LocalJSX.JustifiBusinessForm & JSXBase.HTMLAttributes<HTMLJustifiBusinessFormElement>;
            "justifi-business-representative": LocalJSX.JustifiBusinessRepresentative & JSXBase.HTMLAttributes<HTMLJustifiBusinessRepresentativeElement>;
            "justifi-card-form": LocalJSX.JustifiCardForm & JSXBase.HTMLAttributes<HTMLJustifiCardFormElement>;
            "justifi-payment-form": LocalJSX.JustifiPaymentForm & JSXBase.HTMLAttributes<HTMLJustifiPaymentFormElement>;
            "justifi-payment-method-form": LocalJSX.JustifiPaymentMethodForm & JSXBase.HTMLAttributes<HTMLJustifiPaymentMethodFormElement>;
            "justifi-payment-method-selector": LocalJSX.JustifiPaymentMethodSelector & JSXBase.HTMLAttributes<HTMLJustifiPaymentMethodSelectorElement>;
            "justifi-payments-list": LocalJSX.JustifiPaymentsList & JSXBase.HTMLAttributes<HTMLJustifiPaymentsListElement>;
            "select-input": LocalJSX.SelectInput & JSXBase.HTMLAttributes<HTMLSelectInputElement>;
            "text-input": LocalJSX.TextInput & JSXBase.HTMLAttributes<HTMLTextInputElement>;
        }
    }
}
