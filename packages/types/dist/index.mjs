// src/index.ts
var CountryCode = /* @__PURE__ */ ((CountryCode2) => {
  CountryCode2["USA"] = "USA";
  CountryCode2["CAN"] = "CAN";
  return CountryCode2;
})(CountryCode || {});
var CaptureStrategy = /* @__PURE__ */ ((CaptureStrategy2) => {
  CaptureStrategy2["automatic"] = "automatic";
  CaptureStrategy2["manual"] = "manual";
  return CaptureStrategy2;
})(CaptureStrategy || {});
var PaymentMethodTypes = /* @__PURE__ */ ((PaymentMethodTypes2) => {
  PaymentMethodTypes2["card"] = "card";
  PaymentMethodTypes2["bankAccount"] = "bankAccount";
  PaymentMethodTypes2["sezzle"] = "sezzle";
  PaymentMethodTypes2["plaid"] = "plaid";
  PaymentMethodTypes2["applePay"] = "applePay";
  return PaymentMethodTypes2;
})(PaymentMethodTypes || {});
var PaymentTypes = /* @__PURE__ */ ((PaymentTypes2) => {
  PaymentTypes2["card"] = "Card";
  PaymentTypes2["bankAccount"] = "ACH";
  PaymentTypes2["unknown"] = "Unknown";
  return PaymentTypes2;
})(PaymentTypes || {});
var PaymentStatuses = /* @__PURE__ */ ((PaymentStatuses2) => {
  PaymentStatuses2["pending"] = "pending";
  PaymentStatuses2["automatic"] = "automatic";
  PaymentStatuses2["authorized"] = "authorized";
  PaymentStatuses2["succeeded"] = "succeeded";
  PaymentStatuses2["failed"] = "failed";
  PaymentStatuses2["canceled"] = "canceled";
  PaymentStatuses2["disputed"] = "disputed";
  PaymentStatuses2["fully_refunded"] = "fully_refunded";
  PaymentStatuses2["partially_refunded"] = "partially_refunded";
  return PaymentStatuses2;
})(PaymentStatuses || {});
var CurrencyTypes = /* @__PURE__ */ ((CurrencyTypes2) => {
  CurrencyTypes2["usd"] = "usd";
  CurrencyTypes2["cad"] = "cad";
  return CurrencyTypes2;
})(CurrencyTypes || {});
var RefundStatus = /* @__PURE__ */ ((RefundStatus2) => {
  RefundStatus2["pending"] = "pending";
  RefundStatus2["succeeded"] = "succeeded";
  RefundStatus2["failed"] = "failed";
  return RefundStatus2;
})(RefundStatus || {});
var ICheckoutPaymentMode = /* @__PURE__ */ ((ICheckoutPaymentMode2) => {
  ICheckoutPaymentMode2["bnpl"] = "Buy Now Pay Later";
  ICheckoutPaymentMode2["ecom"] = "E-commerce";
  ICheckoutPaymentMode2["card"] = "Card";
  ICheckoutPaymentMode2["bank_account"] = "Bank Account";
  ICheckoutPaymentMode2["card_present"] = "Card Present";
  ICheckoutPaymentMode2["apple_pay"] = "Apple Pay";
  ICheckoutPaymentMode2["unknown"] = "";
  return ICheckoutPaymentMode2;
})(ICheckoutPaymentMode || {});
var ICheckoutPaymentModeParam = /* @__PURE__ */ ((ICheckoutPaymentModeParam2) => {
  ICheckoutPaymentModeParam2["bnpl"] = "bnpl";
  ICheckoutPaymentModeParam2["ecom"] = "ecom";
  ICheckoutPaymentModeParam2["apple_pay"] = "apple_pay";
  return ICheckoutPaymentModeParam2;
})(ICheckoutPaymentModeParam || {});
var ICheckoutStatus = /* @__PURE__ */ ((ICheckoutStatus2) => {
  ICheckoutStatus2["created"] = "created";
  ICheckoutStatus2["completed"] = "completed";
  ICheckoutStatus2["attempted"] = "attempted";
  ICheckoutStatus2["expired"] = "expired";
  return ICheckoutStatus2;
})(ICheckoutStatus || {});
var CompletionStatuses = /* @__PURE__ */ ((CompletionStatuses2) => {
  CompletionStatuses2["failed"] = "failed";
  CompletionStatuses2["succeeded"] = "succeeded";
  return CompletionStatuses2;
})(CompletionStatuses || {});
var BusinessFormServerErrors = /* @__PURE__ */ ((BusinessFormServerErrors2) => {
  BusinessFormServerErrors2["fetchData"] = "Error retrieving business data";
  BusinessFormServerErrors2["patchData"] = "Error updating business data";
  return BusinessFormServerErrors2;
})(BusinessFormServerErrors || {});
var BusinessClassification = /* @__PURE__ */ ((BusinessClassification2) => {
  BusinessClassification2["sole_proprietor"] = "sole_proprietor";
  BusinessClassification2["partnership"] = "partnership";
  BusinessClassification2["corporation"] = "corporation";
  BusinessClassification2["public_company"] = "public_company";
  BusinessClassification2["limited"] = "limited";
  BusinessClassification2["non_profit"] = "non_profit";
  BusinessClassification2["government"] = "government";
  return BusinessClassification2;
})(BusinessClassification || {});
var EntityDocumentType = /* @__PURE__ */ ((EntityDocumentType2) => {
  EntityDocumentType2["voided_check"] = "voided_check";
  EntityDocumentType2["bank_statement"] = "bank_statement";
  EntityDocumentType2["government_id_front"] = "government_id_front";
  EntityDocumentType2["government_id_back"] = "government_id_back";
  EntityDocumentType2["ss4_form"] = "ss4_form";
  EntityDocumentType2["balance_sheet"] = "balance_sheet";
  EntityDocumentType2["articles_of_incorporation"] = "articles_of_incorporation";
  return EntityDocumentType2;
})(EntityDocumentType || {});
var DisputeStatus = /* @__PURE__ */ ((DisputeStatus2) => {
  DisputeStatus2["needs_response"] = "needs_response";
  DisputeStatus2["under_review"] = "under_review";
  DisputeStatus2["won"] = "won";
  DisputeStatus2["lost"] = "lost";
  return DisputeStatus2;
})(DisputeStatus || {});
var DisputeEvidenceStatus = /* @__PURE__ */ ((DisputeEvidenceStatus2) => {
  DisputeEvidenceStatus2["pending_response"] = "pending_response";
  DisputeEvidenceStatus2["submitted"] = "submitted";
  return DisputeEvidenceStatus2;
})(DisputeEvidenceStatus || {});
var DisputeEvidenceDocumentType = /* @__PURE__ */ ((DisputeEvidenceDocumentType2) => {
  DisputeEvidenceDocumentType2["cancellation_policy"] = "cancellation_policy";
  DisputeEvidenceDocumentType2["customer_communication"] = "customer_communication";
  DisputeEvidenceDocumentType2["customer_signature"] = "customer_signature";
  DisputeEvidenceDocumentType2["duplicate_charge_documentation"] = "duplicate_charge_documentation";
  DisputeEvidenceDocumentType2["receipt"] = "receipt";
  DisputeEvidenceDocumentType2["refund_policy"] = "refund_policy";
  DisputeEvidenceDocumentType2["service_documentation"] = "service_documentation";
  DisputeEvidenceDocumentType2["shipping_documentation"] = "shipping_documentation";
  DisputeEvidenceDocumentType2["uncategorized_file"] = "uncategorized_file";
  return DisputeEvidenceDocumentType2;
})(DisputeEvidenceDocumentType || {});
var PayoutStatus = /* @__PURE__ */ ((PayoutStatus2) => {
  PayoutStatus2["pending"] = "pending";
  PayoutStatus2["in_transit"] = "in_transit";
  PayoutStatus2["paid"] = "paid";
  PayoutStatus2["canceled"] = "canceled";
  PayoutStatus2["failed"] = "failed";
  PayoutStatus2["forwarded"] = "forwarded";
  PayoutStatus2["scheduled"] = "scheduled";
  return PayoutStatus2;
})(PayoutStatus || {});
var SubAccountStatus = /* @__PURE__ */ ((SubAccountStatus2) => {
  SubAccountStatus2["created"] = "created";
  SubAccountStatus2["submitted"] = "submitted";
  SubAccountStatus2["information_needed"] = "information_needed";
  SubAccountStatus2["enabled"] = "enabled";
  SubAccountStatus2["disabled"] = "disabled";
  SubAccountStatus2["rejected"] = "rejected";
  SubAccountStatus2["archived"] = "archived";
  return SubAccountStatus2;
})(SubAccountStatus || {});
var TerminalStatus = /* @__PURE__ */ ((TerminalStatus2) => {
  TerminalStatus2["connected"] = "connected";
  TerminalStatus2["disconnected"] = "disconnected";
  TerminalStatus2["unknown"] = "unknown";
  return TerminalStatus2;
})(TerminalStatus || {});
var TerminalModelName = /* @__PURE__ */ ((TerminalModelName2) => {
  TerminalModelName2["bbpos_chipper_2x"] = "bbpos_chipper_2x";
  TerminalModelName2["pax_a920_pro"] = "pax_a920_pro";
  TerminalModelName2["verifone_P400"] = "verifone_P400";
  TerminalModelName2["stripe_s700"] = "stripe_s700";
  TerminalModelName2["bbpos_wisepos_e"] = "bbpos_wisepos_e";
  return TerminalModelName2;
})(TerminalModelName || {});
var TerminalOrderStatus = /* @__PURE__ */ ((TerminalOrderStatus2) => {
  TerminalOrderStatus2["submitted"] = "submitted";
  TerminalOrderStatus2["processing"] = "processing";
  TerminalOrderStatus2["cancelled"] = "cancelled";
  TerminalOrderStatus2["shipped"] = "shipped";
  TerminalOrderStatus2["delivered"] = "delivered";
  TerminalOrderStatus2["unknown"] = "unknown";
  return TerminalOrderStatus2;
})(TerminalOrderStatus || {});
var TerminalOrderType = /* @__PURE__ */ ((TerminalOrderType2) => {
  TerminalOrderType2["purchase"] = "purchase";
  TerminalOrderType2["return"] = "return";
  return TerminalOrderType2;
})(TerminalOrderType || {});
var ApplePaySessionStatus = /* @__PURE__ */ ((ApplePaySessionStatus2) => {
  ApplePaySessionStatus2[ApplePaySessionStatus2["STATUS_SUCCESS"] = 0] = "STATUS_SUCCESS";
  ApplePaySessionStatus2[ApplePaySessionStatus2["STATUS_FAILURE"] = 1] = "STATUS_FAILURE";
  ApplePaySessionStatus2[ApplePaySessionStatus2["STATUS_INVALID_BILLING_POSTAL_ADDRESS"] = 2] = "STATUS_INVALID_BILLING_POSTAL_ADDRESS";
  ApplePaySessionStatus2[ApplePaySessionStatus2["STATUS_INVALID_SHIPPING_POSTAL_ADDRESS"] = 3] = "STATUS_INVALID_SHIPPING_POSTAL_ADDRESS";
  ApplePaySessionStatus2[ApplePaySessionStatus2["STATUS_INVALID_SHIPPING_CONTACT"] = 4] = "STATUS_INVALID_SHIPPING_CONTACT";
  ApplePaySessionStatus2[ApplePaySessionStatus2["STATUS_PIN_REQUIRED"] = 5] = "STATUS_PIN_REQUIRED";
  ApplePaySessionStatus2[ApplePaySessionStatus2["STATUS_PIN_INCORRECT"] = 6] = "STATUS_PIN_INCORRECT";
  ApplePaySessionStatus2[ApplePaySessionStatus2["STATUS_PIN_LOCKOUT"] = 7] = "STATUS_PIN_LOCKOUT";
  return ApplePaySessionStatus2;
})(ApplePaySessionStatus || {});
var ApplePayButtonType = /* @__PURE__ */ ((ApplePayButtonType2) => {
  ApplePayButtonType2["PLAIN"] = "plain";
  ApplePayButtonType2["BUY"] = "buy";
  ApplePayButtonType2["DONATE"] = "donate";
  return ApplePayButtonType2;
})(ApplePayButtonType || {});
var ApplePayButtonStyle = /* @__PURE__ */ ((ApplePayButtonStyle2) => {
  ApplePayButtonStyle2["BLACK"] = "black";
  ApplePayButtonStyle2["WHITE"] = "white";
  ApplePayButtonStyle2["WHITE_OUTLINE"] = "white-outline";
  return ApplePayButtonStyle2;
})(ApplePayButtonStyle || {});
var ApplePayMerchantCapability = /* @__PURE__ */ ((ApplePayMerchantCapability2) => {
  ApplePayMerchantCapability2["SUPPORTS_3DS"] = "supports3DS";
  ApplePayMerchantCapability2["SUPPORTS_CREDIT"] = "supportsCredit";
  ApplePayMerchantCapability2["SUPPORTS_DEBIT"] = "supportsDebit";
  ApplePayMerchantCapability2["SUPPORTS_EMV"] = "supportsEMV";
  return ApplePayMerchantCapability2;
})(ApplePayMerchantCapability || {});
var GooglePayButtonSizeMode = /* @__PURE__ */ ((GooglePayButtonSizeMode2) => {
  GooglePayButtonSizeMode2["STATIC"] = "static";
  GooglePayButtonSizeMode2["FILL"] = "fill";
  return GooglePayButtonSizeMode2;
})(GooglePayButtonSizeMode || {});
var GooglePayButtonStyle = /* @__PURE__ */ ((GooglePayButtonStyle2) => {
  GooglePayButtonStyle2["BLACK"] = "black";
  GooglePayButtonStyle2["WHITE"] = "white";
  return GooglePayButtonStyle2;
})(GooglePayButtonStyle || {});
var GooglePayButtonType = /* @__PURE__ */ ((GooglePayButtonType2) => {
  GooglePayButtonType2["BOOK"] = "book";
  GooglePayButtonType2["BUY"] = "buy";
  GooglePayButtonType2["CHECKOUT"] = "checkout";
  GooglePayButtonType2["DONATE"] = "donate";
  GooglePayButtonType2["ORDER"] = "order";
  GooglePayButtonType2["PAY"] = "pay";
  GooglePayButtonType2["PLAIN"] = "plain";
  GooglePayButtonType2["SUBSCRIBE"] = "subscribe";
  return GooglePayButtonType2;
})(GooglePayButtonType || {});
var GooglePayEnvironment = /* @__PURE__ */ ((GooglePayEnvironment2) => {
  GooglePayEnvironment2["TEST"] = "TEST";
  GooglePayEnvironment2["PRODUCTION"] = "PRODUCTION";
  return GooglePayEnvironment2;
})(GooglePayEnvironment || {});
export {
  ApplePayButtonStyle,
  ApplePayButtonType,
  ApplePayMerchantCapability,
  ApplePaySessionStatus,
  BusinessClassification,
  BusinessFormServerErrors,
  CaptureStrategy,
  CompletionStatuses,
  CountryCode,
  CurrencyTypes,
  DisputeEvidenceDocumentType,
  DisputeEvidenceStatus,
  DisputeStatus,
  EntityDocumentType,
  GooglePayButtonSizeMode,
  GooglePayButtonStyle,
  GooglePayButtonType,
  GooglePayEnvironment,
  ICheckoutPaymentMode,
  ICheckoutPaymentModeParam,
  ICheckoutStatus,
  PaymentMethodTypes,
  PaymentStatuses,
  PaymentTypes,
  PayoutStatus,
  RefundStatus,
  SubAccountStatus,
  TerminalModelName,
  TerminalOrderStatus,
  TerminalOrderType,
  TerminalStatus
};
//# sourceMappingURL=index.mjs.map