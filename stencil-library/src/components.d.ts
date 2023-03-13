/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { ValidationError } from "yup";
import { Theme } from "./components/payment-method-form/theme";
export namespace Components {
    interface JustifiBankAccountForm {
        "styleOverrides"?: string;
        "tokenize": (clientKey: string, paymentMethodMetadata: any, account?: string) => Promise<any>;
        "validate": () => Promise<any>;
        "validationStrategy": 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
    }
    interface JustifiBillingForm {
        "validate": () => Promise<{ isValid: boolean; }>;
    }
    interface JustifiCardForm {
        "styleOverrides"?: string;
        "tokenize": (clientKey: string, paymentMethodMetadata: any, account?: string) => Promise<any>;
        "validate": () => Promise<any>;
        "validationStrategy": 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
    }
    interface JustifiPaymentMethodForm {
        "paymentMethodFormType": 'card' | 'bankAccount';
        "paymentMethodFormValidationStrategy": 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
        "paymentMethodStyleOverrides": Theme | undefined;
        "tokenize": (clientKey: string, paymentMethodMetadata: any, account?: string) => Promise<any>;
        "validate": () => Promise<any>;
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
        "options": { label: string, value: string }[];
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
export interface JustifiPaymentMethodFormCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLJustifiPaymentMethodFormElement;
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
    interface HTMLJustifiBankAccountFormElement extends Components.JustifiBankAccountForm, HTMLStencilElement {
    }
    var HTMLJustifiBankAccountFormElement: {
        prototype: HTMLJustifiBankAccountFormElement;
        new (): HTMLJustifiBankAccountFormElement;
    };
    interface HTMLJustifiBillingFormElement extends Components.JustifiBillingForm, HTMLStencilElement {
    }
    var HTMLJustifiBillingFormElement: {
        prototype: HTMLJustifiBillingFormElement;
        new (): HTMLJustifiBillingFormElement;
    };
    interface HTMLJustifiCardFormElement extends Components.JustifiCardForm, HTMLStencilElement {
    }
    var HTMLJustifiCardFormElement: {
        prototype: HTMLJustifiCardFormElement;
        new (): HTMLJustifiCardFormElement;
    };
    interface HTMLJustifiPaymentMethodFormElement extends Components.JustifiPaymentMethodForm, HTMLStencilElement {
    }
    var HTMLJustifiPaymentMethodFormElement: {
        prototype: HTMLJustifiPaymentMethodFormElement;
        new (): HTMLJustifiPaymentMethodFormElement;
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
        "justifi-bank-account-form": HTMLJustifiBankAccountFormElement;
        "justifi-billing-form": HTMLJustifiBillingFormElement;
        "justifi-card-form": HTMLJustifiCardFormElement;
        "justifi-payment-method-form": HTMLJustifiPaymentMethodFormElement;
        "justifi-payments-list": HTMLJustifiPaymentsListElement;
        "select-input": HTMLSelectInputElement;
        "text-input": HTMLTextInputElement;
    }
}
declare namespace LocalJSX {
    interface JustifiBankAccountForm {
        "onBankAccountFormReady"?: (event: JustifiBankAccountFormCustomEvent<any>) => void;
        "onBankAccountFormTokenize"?: (event: JustifiBankAccountFormCustomEvent<{ data: any }>) => void;
        "onBankAccountFormValidate"?: (event: JustifiBankAccountFormCustomEvent<{ data: { isValid: boolean } }>) => void;
        "styleOverrides"?: string;
        "validationStrategy"?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
    }
    interface JustifiBillingForm {
    }
    interface JustifiCardForm {
        "onCardFormReady"?: (event: JustifiCardFormCustomEvent<any>) => void;
        "onCardFormTokenize"?: (event: JustifiCardFormCustomEvent<{ data: any }>) => void;
        "onCardFormValidate"?: (event: JustifiCardFormCustomEvent<{ data: { isValid: boolean } }>) => void;
        "styleOverrides"?: string;
        "validationStrategy"?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
    }
    interface JustifiPaymentMethodForm {
        "onPaymentMethodFormReady"?: (event: JustifiPaymentMethodFormCustomEvent<any>) => void;
        "onPaymentMethodFormTokenize"?: (event: JustifiPaymentMethodFormCustomEvent<{ data: any }>) => void;
        "paymentMethodFormType"?: 'card' | 'bankAccount';
        "paymentMethodFormValidationStrategy"?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
        "paymentMethodStyleOverrides"?: Theme | undefined;
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
        "onFieldReceivedInput"?: (event: SelectInputCustomEvent<{ name: string, value: string }>) => void;
        "options"?: { label: string, value: string }[];
    }
    interface TextInput {
        "defaultValue"?: string;
        "error"?: string;
        "label"?: string;
        "name"?: string;
        "onFieldReceivedInput"?: (event: TextInputCustomEvent<{ name: string, value: string }>) => void;
    }
    interface IntrinsicElements {
        "justifi-bank-account-form": JustifiBankAccountForm;
        "justifi-billing-form": JustifiBillingForm;
        "justifi-card-form": JustifiCardForm;
        "justifi-payment-method-form": JustifiPaymentMethodForm;
        "justifi-payments-list": JustifiPaymentsList;
        "select-input": SelectInput;
        "text-input": TextInput;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "justifi-bank-account-form": LocalJSX.JustifiBankAccountForm & JSXBase.HTMLAttributes<HTMLJustifiBankAccountFormElement>;
            "justifi-billing-form": LocalJSX.JustifiBillingForm & JSXBase.HTMLAttributes<HTMLJustifiBillingFormElement>;
            "justifi-card-form": LocalJSX.JustifiCardForm & JSXBase.HTMLAttributes<HTMLJustifiCardFormElement>;
            "justifi-payment-method-form": LocalJSX.JustifiPaymentMethodForm & JSXBase.HTMLAttributes<HTMLJustifiPaymentMethodFormElement>;
            "justifi-payments-list": LocalJSX.JustifiPaymentsList & JSXBase.HTMLAttributes<HTMLJustifiPaymentsListElement>;
            "select-input": LocalJSX.SelectInput & JSXBase.HTMLAttributes<HTMLSelectInputElement>;
            "text-input": LocalJSX.TextInput & JSXBase.HTMLAttributes<HTMLTextInputElement>;
        }
    }
}
