/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone } from '@angular/core';

import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

import { Components } from '@justifi/webcomponents';


@ProxyCmp({
  inputs: ['defaultValue', 'error', 'inputHandler', 'label', 'name', 'options']
})
@Component({
  selector: 'form-control-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['defaultValue', 'error', 'inputHandler', 'label', 'name', 'options'],
})
export class FormControlSelect {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['formControlInput', 'formControlBlur']);
  }
}


export declare interface FormControlSelect extends Components.FormControlSelect {

  formControlInput: EventEmitter<CustomEvent<any>>;

  formControlBlur: EventEmitter<CustomEvent<any>>;
}


@ProxyCmp({
  inputs: ['defaultValue', 'error', 'inputHandler', 'label', 'name']
})
@Component({
  selector: 'form-control-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['defaultValue', 'error', 'inputHandler', 'label', 'name'],
})
export class FormControlText {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['formControlInput', 'formControlBlur']);
  }
}


export declare interface FormControlText extends Components.FormControlText {

  formControlInput: EventEmitter<CustomEvent<any>>;

  formControlBlur: EventEmitter<CustomEvent<any>>;
}


@ProxyCmp({
  inputs: ['iframeOrigin', 'validationMode'],
  methods: ['tokenize', 'validate', 'resize']
})
@Component({
  selector: 'justifi-bank-account-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['iframeOrigin', 'validationMode'],
})
export class JustifiBankAccountForm {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['bankAccountFormReady', 'ready', 'bankAccountFormTokenize', 'bankAccountFormValidate']);
  }
}


export declare interface JustifiBankAccountForm extends Components.JustifiBankAccountForm {
  /**
   * Triggered when iframe has loaded @event justifi-bank-account-form#bankAccountFormReady
   */
  bankAccountFormReady: EventEmitter<CustomEvent<any>>;
  /**
   * Triggered when iframe has loaded @event justifi-bank-account-form#ready
   */
  ready: EventEmitter<CustomEvent<any>>;
  /**
   * Triggered when the tokenize method is called on the component @event justifi-bank-account-form#bankAccountFormTokenize
   */
  bankAccountFormTokenize: EventEmitter<CustomEvent<{ data: any }>>;
  /**
   * Triggered when the validate method is called on the component @event justifi-bank-account-form#bankAccountFormValidate
   */
  bankAccountFormValidate: EventEmitter<CustomEvent<{ data: { isValid: boolean } }>>;
}


@ProxyCmp({
  inputs: ['legend'],
  methods: ['fill', 'validate', 'getValues']
})
@Component({
  selector: 'justifi-billing-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['legend'],
})
export class JustifiBillingForm {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface JustifiBillingForm extends Components.JustifiBillingForm {}


@ProxyCmp({
  inputs: ['defaultValues', 'errors', 'onFormUpdate']
})
@Component({
  selector: 'justifi-business-address-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['defaultValues', 'errors', 'onFormUpdate'],
})
export class JustifiBusinessAddressForm {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface JustifiBusinessAddressForm extends Components.JustifiBusinessAddressForm {}


@ProxyCmp({
  inputs: ['authToken', 'businessId']
})
@Component({
  selector: 'justifi-business-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['authToken', 'businessId'],
})
export class JustifiBusinessForm {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface JustifiBusinessForm extends Components.JustifiBusinessForm {}


@ProxyCmp({
  inputs: ['formController']
})
@Component({
  selector: 'justifi-business-generic-info',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['formController'],
})
export class JustifiBusinessGenericInfo {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface JustifiBusinessGenericInfo extends Components.JustifiBusinessGenericInfo {}


@ProxyCmp({
  inputs: ['formController']
})
@Component({
  selector: 'justifi-business-representative',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['formController'],
})
export class JustifiBusinessRepresentative {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface JustifiBusinessRepresentative extends Components.JustifiBusinessRepresentative {}


@ProxyCmp({
  inputs: ['iframeOrigin', 'singleLine', 'validationMode'],
  methods: ['tokenize', 'validate', 'resize']
})
@Component({
  selector: 'justifi-card-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['iframeOrigin', 'singleLine', 'validationMode'],
})
export class JustifiCardForm {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['cardFormReady', 'ready', 'cardFormTokenize', 'cardFormValidate']);
  }
}


export declare interface JustifiCardForm extends Components.JustifiCardForm {
  /**
   * Triggered when iframe has loaded @event justifi-card-form#cardFormReady
   */
  cardFormReady: EventEmitter<CustomEvent<any>>;
  /**
   * Triggered when iframe has loaded @event justifi-card-form#ready
   */
  ready: EventEmitter<CustomEvent<any>>;
  /**
   * Triggered when the tokenize method is called on the component @event justifi-card-form#cardFormTokenize
   */
  cardFormTokenize: EventEmitter<CustomEvent<{ data: any }>>;
  /**
   * Triggered when the validate method is called on the component @event justifi-card-form#cardFormTokenize
   */
  cardFormValidate: EventEmitter<CustomEvent<{ data: { isValid: boolean } }>>;
}


@ProxyCmp({
  inputs: ['accountId', 'bankAccount', 'card', 'clientId', 'email', 'iframeOrigin', 'submitButtonText'],
  methods: ['fillBillingForm', 'enableSubmitButton', 'loadFontsOnParent']
})
@Component({
  selector: 'justifi-payment-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['accountId', 'bankAccount', 'card', 'clientId', 'email', 'iframeOrigin', 'submitButtonText'],
})
export class JustifiPaymentForm {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['submitted']);
  }
}


import type { CreatePaymentMethodResponse as IJustifiPaymentFormCreatePaymentMethodResponse } from '@justifi/webcomponents';

export declare interface JustifiPaymentForm extends Components.JustifiPaymentForm {

  submitted: EventEmitter<CustomEvent<IJustifiPaymentFormCreatePaymentMethodResponse>>;
}


@ProxyCmp({
  inputs: ['iframeOrigin', 'paymentMethodFormType', 'paymentMethodFormValidationMode', 'singleLine'],
  methods: ['tokenize', 'validate', 'resize']
})
@Component({
  selector: 'justifi-payment-method-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['iframeOrigin', 'paymentMethodFormType', 'paymentMethodFormValidationMode', 'singleLine'],
})
export class JustifiPaymentMethodForm {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['paymentMethodFormReady', 'paymentMethodFormTokenize']);
  }
}


export declare interface JustifiPaymentMethodForm extends Components.JustifiPaymentMethodForm {

  paymentMethodFormReady: EventEmitter<CustomEvent<any>>;

  paymentMethodFormTokenize: EventEmitter<CustomEvent<{ data: any }>>;
}


@ProxyCmp({
  inputs: ['paymentMethodTypes', 'selectedPaymentMethodType']
})
@Component({
  selector: 'justifi-payment-method-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['paymentMethodTypes', 'selectedPaymentMethodType'],
})
export class JustifiPaymentMethodSelector {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['paymentMethodSelected']);
  }
}


export declare interface JustifiPaymentMethodSelector extends Components.JustifiPaymentMethodSelector {

  paymentMethodSelected: EventEmitter<CustomEvent<any>>;
}


@ProxyCmp({
  inputs: ['accountId', 'authToken']
})
@Component({
  selector: 'justifi-payments-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['accountId', 'authToken'],
})
export class JustifiPaymentsList {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface JustifiPaymentsList extends Components.JustifiPaymentsList {}


@ProxyCmp({
  inputs: ['accountId', 'authToken']
})
@Component({
  selector: 'justifi-payouts-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['accountId', 'authToken'],
})
export class JustifiPayoutsList {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface JustifiPayoutsList extends Components.JustifiPayoutsList {}


@ProxyCmp({
  inputs: ['defaultValue', 'error', 'label', 'name', 'options']
})
@Component({
  selector: 'select-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['defaultValue', 'error', 'label', 'name', 'options'],
})
export class SelectInput {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['fieldReceivedInput']);
  }
}


export declare interface SelectInput extends Components.SelectInput {

  fieldReceivedInput: EventEmitter<CustomEvent<{ name: string; value: string }>>;
}


@ProxyCmp({
  inputs: ['defaultValue', 'error', 'label', 'name']
})
@Component({
  selector: 'text-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['defaultValue', 'error', 'label', 'name'],
})
export class TextInput {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['fieldReceivedInput']);
  }
}


export declare interface TextInput extends Components.TextInput {

  fieldReceivedInput: EventEmitter<CustomEvent<{ name: string; value: string }>>;
}


