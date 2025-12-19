'use strict';

// src/entities/BankAccount.ts
var BankAccount = class {
  constructor(data) {
    this.id = data.id;
    this.account_owner_name = data.account_owner_name;
    this.full_name = data.full_name;
    this.account_type = data.account_type;
    this.account_number = data.account_number;
    this.acct_last_four = data.acct_last_four;
    this.account_number_last4 = data.account_number_last4;
    this.routing_number = data.routing_number;
    this.institution_number = data.institution_number;
    this.transit_number = data.transit_number;
    this.bank_name = data.bank_name;
    this.country = data.country;
    this.currency = data.currency;
    this.nickname = data.nickname;
    this.metadata = data.metadata;
    this.business_id = data.business_id;
    this.platform_account_id = data.platform_account_id;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
  get payload() {
    return {
      account_owner_name: this.account_owner_name || "",
      account_type: this.account_type || "",
      account_number: this.account_number || "",
      routing_number: this.routing_number || "",
      institution_number: this.institution_number || "",
      transit_number: this.transit_number || "",
      bank_name: this.bank_name || "",
      nickname: this.nickname || "",
      business_id: this.business_id || ""
    };
  }
};

// src/entities/Dispute.ts
var DisputeStatus = /* @__PURE__ */ ((DisputeStatus2) => {
  DisputeStatus2["won"] = "won";
  DisputeStatus2["lost"] = "lost";
  DisputeStatus2["underReview"] = "under_review";
  DisputeStatus2["needsResponse"] = "needs_response";
  return DisputeStatus2;
})(DisputeStatus || {});
var Dispute = class {
  get needsResponse() {
    return this.status == "needs_response" /* needsResponse */;
  }
  get underReview() {
    return this.status == "under_review" /* underReview */;
  }
  get won() {
    return this.status == "won" /* won */;
  }
  get lost() {
    return this.status == "lost" /* lost */;
  }
  constructor(dispute) {
    this.id = dispute.id;
    this.amount = dispute.amount;
    this.currency = dispute.currency;
    this.payment_id = dispute.payment_id;
    this.reason = dispute.reason;
    this.due_date = dispute.due_date;
    this.status = dispute.status;
    this.metadata = dispute.metadata;
    this.created_at = dispute.created_at;
    this.updated_at = dispute.updated_at;
    this.dispute_response = dispute.dispute_response ? new DisputeResponse(dispute.dispute_response) : void 0;
  }
};
var DisputeResponse = class {
  constructor(response) {
    this.additional_statement = response.additional_statement;
    this.cancellation_policy_disclosure = response.cancellation_policy_disclosure;
    this.cancellation_rebuttal = response.cancellation_rebuttal;
    this.customer_billing_address = response.customer_billing_address;
    this.customer_email_address = response.customer_email_address;
    this.customer_name = response.customer_name;
    this.customer_purchase_ip_address = response.customer_purchase_ip_address;
    this.duplicate_charge_explanation = response.duplicate_charge_explanation;
    this.product_description = response.product_description;
    this.refund_policy_disclosure = response.refund_policy_disclosure;
    this.refund_refusal_explanation = response.refund_refusal_explanation;
    this.service_date = response.service_date;
    this.shipping_address = response.shipping_address;
    this.shipping_carrier = response.shipping_carrier;
    this.shipping_date = response.shipping_date;
    this.shipping_tracking_number = response.shipping_tracking_number;
    this.duplicate_charge_original_payment_id = response.duplicate_charge_original_payment_id;
  }
};

// src/entities/Refund.ts
var RefundStatuses = /* @__PURE__ */ ((RefundStatuses2) => {
  RefundStatuses2["succeeded"] = "succeeded";
  RefundStatuses2["failed"] = "failed";
  return RefundStatuses2;
})(RefundStatuses || {});
var RefundReasons = /* @__PURE__ */ ((RefundReasons2) => {
  RefundReasons2["customerRequest"] = "customer_request";
  RefundReasons2["duplicate"] = "duplicate";
  RefundReasons2["fraudulent"] = "fraudulent";
  return RefundReasons2;
})(RefundReasons || {});
var RefundPayload = class {
  constructor(refundPayload) {
    this.amount = refundPayload.amount;
    this.reason = refundPayload.reason;
    this.description = refundPayload.description;
    this.metadata = refundPayload.metadata;
  }
};
var Refund = class {
  constructor(refund) {
    this.amount = refund.amount;
    this.created_at = refund.created_at;
    this.description = refund.description;
    this.id = refund.id;
    this.metadata = refund.metadata;
    this.payment_id = refund.payment_id;
    this.reason = refund.reason;
    this.status = refund.status;
    this.updated_at = refund.updated_at;
  }
};

// src/entities/SubAccount.ts
var AccountType = /* @__PURE__ */ ((AccountType2) => {
  AccountType2["test"] = "test";
  AccountType2["live"] = "live";
  return AccountType2;
})(AccountType || {});
var AccountStatus = /* @__PURE__ */ ((AccountStatus2) => {
  AccountStatus2["created"] = "created";
  AccountStatus2["submitted"] = "submitted";
  AccountStatus2["information_needed"] = "information_needed";
  AccountStatus2["rejected"] = "rejected";
  AccountStatus2["enabled"] = "enabled";
  AccountStatus2["disabled"] = "disabled";
  AccountStatus2["archived"] = "archived";
  return AccountStatus2;
})(AccountStatus || {});
var SubAccount = class {
  constructor(subAccount) {
    this.id = subAccount.id;
    this.name = subAccount.name;
    this.account_type = subAccount.account_type;
    this.status = subAccount.status;
    this.currency = subAccount.currency;
    this.platform_account_id = subAccount.platform_account_id;
    this.payout_account_id = subAccount.payout_account_id;
    this.business_id = subAccount.business_id;
    this.application_fee_rates = subAccount.application_fee_rates;
    this.processing_ready = subAccount.processing_ready;
    this.payout_ready = subAccount.payout_ready;
    this.related_accounts = subAccount.related_accounts;
    this.created_at = subAccount.created_at;
    this.updated_at = subAccount.updated_at;
  }
};

// src/entities/TerminalModel.ts
var TerminalModelName = /* @__PURE__ */ ((TerminalModelName2) => {
  TerminalModelName2["v400"] = "v400";
  TerminalModelName2["p400"] = "p400+";
  TerminalModelName2["e285"] = "e285";
  return TerminalModelName2;
})(TerminalModelName || {});
var TerminalModel = class {
  constructor(data) {
    this.id = data.id;
    this.model_name = data.model_name;
    this.description = data.description;
    this.image_url = data.image_url;
    this.help_url = data.help_url;
  }
};

// src/entities/Terminal.ts
var ITerminalStatus = /* @__PURE__ */ ((ITerminalStatus2) => {
  ITerminalStatus2["connected"] = "connected";
  ITerminalStatus2["disconnected"] = "disconnected";
  ITerminalStatus2["unknown"] = "unknown";
  ITerminalStatus2["pending_configuration"] = "pending_configuration";
  ITerminalStatus2["archived"] = "archived";
  return ITerminalStatus2;
})(ITerminalStatus || {});
var TerminalProviders = /* @__PURE__ */ ((TerminalProviders2) => {
  TerminalProviders2["verifone"] = "verifone";
  return TerminalProviders2;
})(TerminalProviders || {});
var Terminal = class {
  constructor(data) {
    this.id = data.id || "";
    this.status = data.status;
    this.account_id = data.account_id || "";
    this.platform_account_id = data.platform_account_id || "";
    this.provider = data.provider || void 0;
    this.provider_id = data.provider_id || "";
    this.provider_serial_number = data.provider_serial_number || "";
    this.created_at = data.created_at || "";
    this.updated_at = data.updated_at || "";
    this.verified_at = data.verified_at || "";
    this.nickname = data.nickname || "";
    this.model_name = data.model_name || void 0;
  }
};

// src/entities/TerminalOrder.ts
var TerminalOrderType = /* @__PURE__ */ ((TerminalOrderType2) => {
  TerminalOrderType2["boardingOnly"] = "boarding_only";
  TerminalOrderType2["boardingShipping"] = "boarding_shipping";
  return TerminalOrderType2;
})(TerminalOrderType || {});
var TerminalOrderStatus = /* @__PURE__ */ ((TerminalOrderStatus2) => {
  TerminalOrderStatus2["created"] = "created";
  TerminalOrderStatus2["submitted"] = "submitted";
  TerminalOrderStatus2["completed"] = "completed";
  TerminalOrderStatus2["in_progress"] = "in_progress";
  TerminalOrderStatus2["on_hold"] = "on_hold";
  TerminalOrderStatus2["canceled"] = "canceled";
  return TerminalOrderStatus2;
})(TerminalOrderStatus || {});
var TerminalOrder = class {
  constructor(data) {
    this.id = data.id;
    this.business_id = data.business_id;
    this.company_name = data.company_name;
    this.sub_account_id = data.sub_account_id;
    this.provider = data.provider || "verifone" /* verifone */;
    this.order_items = [];
    this.order_type = data.order_type;
    this.order_status = data.order_status;
    this.terminals = data.terminals;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
  get payload() {
    return {
      business_id: this.business_id,
      sub_account_id: this.sub_account_id,
      order_type: this.order_type,
      order_items: this.order_items
    };
  }
  get totalQuantity() {
    return this.order_items.reduce((acc, item) => acc + item.quantity, 0);
  }
  updateTerminal(model_name, quantity) {
    if (quantity === 0) {
      this.order_items = this.order_items.filter(
        (t) => t.model_name !== model_name
      );
      return;
    }
    const terminal = this.order_items.find((t) => t.model_name === model_name);
    if (terminal) {
      terminal.quantity = quantity;
    } else {
      this.order_items.push({ model_name, quantity });
    }
  }
};

// src/entities/Payment.ts
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
var PaymentMethodData = class {
  constructor(paymentMethod) {
    this.card = paymentMethod.card ? new PaymentCard(paymentMethod.card) : void 0;
    this.bank_account = paymentMethod.bank_account ? new PaymentBankAccount(paymentMethod.bank_account) : void 0;
  }
  get payersName() {
    if (this.card) {
      return this.card.name;
    } else if (this.bank_account) {
      return this.bank_account.name;
    }
    return null;
  }
  get lastFourDigits() {
    if (this.card) {
      return `**** ${this.card.acct_last_four}`;
    } else if (this.bank_account) {
      return `**** ${this.bank_account.acct_last_four}`;
    }
    return null;
  }
};
var PaymentBankAccount = class {
  constructor(bankAccount) {
    this.id = bankAccount.id;
    this.acct_last_four = bankAccount.acct_last_four;
    this.name = bankAccount.name;
    this.brand = bankAccount.brand;
    this.token = bankAccount.token;
    this.created_at = bankAccount.created_at;
    this.updated_at = bankAccount.updated_at;
  }
};
var PaymentCard = class {
  constructor(card) {
    this.id = card.id || "";
    this.acct_last_four = card.acct_last_four;
    this.name = card.name;
    this.brand = card.brand;
    this.token = card.token;
    this.created_at = card.created_at;
    this.updated_at = card.updated_at;
  }
};
var Payment = class {
  constructor(payment) {
    this.id = payment.id;
    this.account_id = payment.account_id;
    this.currency = payment.currency;
    this.amount = payment.amount;
    this.amount_disputed = payment.amount_disputed;
    this.amount_refundable = payment.amount_refundable;
    this.amount_refunded = payment.amount_refunded;
    this.balance = payment.balance;
    this.captured = payment.captured;
    this.capture_strategy = payment.capture_strategy;
    this.description = payment.description;
    this.disputed = payment.disputed;
    this.disputes = payment.disputes;
    this.error_code = payment.error_code;
    this.error_description = payment.error_description;
    this.expedited = payment.expedited;
    this.fee_amount = payment.fee_amount;
    this.is_test = payment.is_test;
    this.metadata = payment.metadata;
    this.payment_method = new PaymentMethodData(payment.payment_method);
    this.payment_intent_id = payment.payment_intent_id ?? null;
    this.refunded = payment.refunded;
    this.status = payment.status;
    this.created_at = payment.created_at;
    this.updated_at = payment.updated_at;
    this.statement_descriptor = payment.statement_descriptor;
    this.financial_transaction_id = payment.financial_transaction_id;
    this.returned = payment.returned;
    this.application_fee = payment.application_fee;
    this.refunds = payment.refunds;
    this.transaction_hold = payment.transaction_hold ?? null;
  }
  get disputedStatus() {
    const lost = this.disputes.some(
      (dispute) => dispute.status === "lost" /* lost */
    );
    if (!this.disputed) {
      return null;
    } else if (lost) {
      return "lost" /* lost */;
    } else {
      return "open";
    }
  }
  get payment_type() {
    if (this.payment_method) {
      return this.payment_method.card ? "Card" /* card */ : "ACH" /* bankAccount */;
    } else {
      return "Unknown" /* unknown */;
    }
  }
  get payers_name() {
    return this.payment_method.payersName;
  }
  get last_four_digits() {
    return this.payment_method.lastFourDigits;
  }
};

// src/entities/Checkout.ts
var PAYMENT_METHOD_TYPES = /* @__PURE__ */ ((PAYMENT_METHOD_TYPES2) => {
  PAYMENT_METHOD_TYPES2["CARD"] = "card";
  PAYMENT_METHOD_TYPES2["BANK_ACCOUNT"] = "bank_account";
  PAYMENT_METHOD_TYPES2["APPLE_PAY"] = "apple_pay";
  PAYMENT_METHOD_TYPES2["GOOGLE_PAY"] = "google_pay";
  PAYMENT_METHOD_TYPES2["SEZZLE"] = "sezzle";
  PAYMENT_METHOD_TYPES2["PLAID"] = "plaid";
  return PAYMENT_METHOD_TYPES2;
})(PAYMENT_METHOD_TYPES || {});
var Completion = class {
  constructor(data) {
    this.payment_mode = data.payment_mode;
    this.payment_token = data.payment_token;
    this.payment_status = data.payment_status;
    this.payment_response = data.payment_response;
    this.payment_error_code = data.payment_error_code;
    this.payment_error_description = data.payment_error_description;
    this.checkout_id = data.checkout_id;
    this.additional_transactions = data.additional_transactions;
    this.payment_id = data.payment_id;
    this.payment_method_id = data.payment_method_id;
    this.status = data.status;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
};
var Checkout = class {
  constructor(data) {
    this.id = data.id;
    this.description = data.description;
    this.payment_intent_id = data.payment_intent_id;
    this.account_id = data.account_id;
    this.platform_account_id = data.platform_account_id;
    this.payment_amount = data.payment_amount;
    this.payment_client_id = data.payment_client_id;
    this.payment_description = data.payment_description;
    this.payment_methods = data.payment_methods;
    this.payment_method_group_id = data.payment_method_group_id;
    this.payment_settings = data.payment_settings;
    this.bnpl = data.bnpl;
    this.total_amount = data.total_amount;
    this.insurance_amount = data.insurance_amount;
    this.status = data.status;
    this.payment_currency = data.payment_currency;
    this.mode = data.mode;
    this.statement_descriptor = data.statement_descriptor;
    this.application_fees = data.application_fees;
    this.successful_payment_id = data.successful_payment_id;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.completions = data.completions?.map(
      (completion) => new Completion(completion)
    );
  }
  get payment_mode() {
    let paymentMode = "" /* unknown */;
    if (!this.completions || this.completions.length === 0) {
      return "" /* unknown */;
    }
    const sortedCompletions = this.completions.sort((a, b) => {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
    const lastCompletion = sortedCompletions[0];
    if (lastCompletion.payment_mode) {
      paymentMode = lastCompletion.payment_mode;
    } else if (lastCompletion.payment_response?.data?.payment_method?.card) {
      paymentMode = "Card" /* card */;
    } else if (lastCompletion.payment_response?.data?.payment_method?.bank_account) {
      paymentMode = "Bank Account" /* bank_account */;
    }
    return paymentMode;
  }
};
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

// src/entities/Payout.ts
var PayoutStatuses = /* @__PURE__ */ ((PayoutStatuses2) => {
  PayoutStatuses2["paid"] = "paid";
  PayoutStatuses2["failed"] = "failed";
  PayoutStatuses2["forwarded"] = "forwarded";
  PayoutStatuses2["scheduled"] = "scheduled";
  PayoutStatuses2["in_transit"] = "in_transit";
  PayoutStatuses2["canceled"] = "canceled";
  return PayoutStatuses2;
})(PayoutStatuses || {});
var PayoutStatusesSafeNames = /* @__PURE__ */ ((PayoutStatusesSafeNames2) => {
  PayoutStatusesSafeNames2["paid"] = "Paid";
  PayoutStatusesSafeNames2["failed"] = "Failed";
  PayoutStatusesSafeNames2["forwarded"] = "Forwarded";
  PayoutStatusesSafeNames2["scheduled"] = "Scheduled";
  PayoutStatusesSafeNames2["in_transit"] = "In Transit";
  PayoutStatusesSafeNames2["canceled"] = "Canceled";
  return PayoutStatusesSafeNames2;
})(PayoutStatusesSafeNames || {});
var Payout = class {
  constructor(payout) {
    this.id = payout.id;
    this.account_id = payout.account_id;
    this.currency = payout.currency;
    this.amount = payout.amount;
    this.bank_account = payout.bank_account;
    this.delivery_method = payout.delivery_method || "standard";
    this.description = payout.description;
    this.deposits_at = payout.deposits_at;
    this.fees_total = payout.fees_total;
    this.refunds_count = payout.refunds_count;
    this.refunds_total = payout.refunds_total;
    this.payments_count = payout.payments_count;
    this.payments_total = payout.payments_total;
    this.payout_type = payout.payout_type;
    this.other_total = payout.other_total;
    this.status = payout.status;
    this.metadata = payout.metadata;
    this.created_at = payout.created_at;
    this.updated_at = payout.updated_at;
    this.settlement_priority = payout.settlement_priority || "standard";
  }
};

// src/entities/PaymentBalanceTransaction.ts
var PaymentBalanceTxnType = /* @__PURE__ */ ((PaymentBalanceTxnType2) => {
  PaymentBalanceTxnType2["payment"] = "payment";
  PaymentBalanceTxnType2["paymentFee"] = "payment_fee";
  PaymentBalanceTxnType2["payout"] = "payout";
  PaymentBalanceTxnType2["refund"] = "refund";
  PaymentBalanceTxnType2["feeRefund"] = "fee_refund";
  PaymentBalanceTxnType2["dispute"] = "dispute";
  PaymentBalanceTxnType2["disputeFee"] = "dispute_fee";
  PaymentBalanceTxnType2["disputeFeeRefund"] = "dispute_fee_refund";
  PaymentBalanceTxnType2["disputeRefund"] = "dispute_refund";
  PaymentBalanceTxnType2["applicationFeeReturned"] = "application_fee_returned";
  return PaymentBalanceTxnType2;
})(PaymentBalanceTxnType || {});
var PaymentBalanceTransaction = class {
  constructor(balanceTransaction) {
    this.id = balanceTransaction.id;
    this.amount = balanceTransaction.amount;
    this.balance = balanceTransaction.balance;
    this.currency = balanceTransaction.currency;
    this.financial_transaction_id = balanceTransaction.financial_transaction_id;
    this.payment_id = balanceTransaction.payment_id;
    this.payment_balance_txn_type = balanceTransaction.payment_balance_txn_type;
    this.source_id = balanceTransaction.source_id;
    this.source_type = balanceTransaction.source_type;
    this.created_at = balanceTransaction.created_at;
    this.updated_at = balanceTransaction.updated_at;
  }
  get displayTransactionId() {
    if (this.payment_balance_txn_type === "payment_fee" /* paymentFee */) {
      return "--";
    } else if (this.payment_balance_txn_type === "application_fee_returned" /* applicationFeeReturned */) {
      return "--";
    } else {
      return this.source_id;
    }
  }
};

// src/entities/PayoutBalanceTransaction.ts
var PayoutBalanceTransactionType = /* @__PURE__ */ ((PayoutBalanceTransactionType2) => {
  PayoutBalanceTransactionType2["fee"] = "fee";
  PayoutBalanceTransactionType2["payment"] = "payment";
  PayoutBalanceTransactionType2["payout"] = "payout";
  PayoutBalanceTransactionType2["sellerPaymentRefund"] = "seller_payment_refund";
  PayoutBalanceTransactionType2["disputeAmountCollected"] = "dispute_amount_collected";
  PayoutBalanceTransactionType2["disputeFeeCollected"] = "dispute_fee_collected";
  PayoutBalanceTransactionType2["sellerPayment"] = "seller_payment";
  PayoutBalanceTransactionType2["transfer"] = "transfer";
  PayoutBalanceTransactionType2["partnerPlatformProceedsCredit"] = "partner_platform_proceeds_credit";
  return PayoutBalanceTransactionType2;
})(PayoutBalanceTransactionType || {});
var PayoutBalanceTransaction = class {
  constructor(balanceTransaction) {
    this.id = balanceTransaction.id;
    this.account_id = balanceTransaction.account_id;
    this.payout_id = balanceTransaction.payout_id;
    this.financial_transaction_id = balanceTransaction.financial_transaction_id;
    this.amount = balanceTransaction.amount;
    this.fee = balanceTransaction.fee;
    this.net = balanceTransaction.net;
    this.currency = balanceTransaction.currency;
    this.source_id = balanceTransaction.source_id;
    this.description = balanceTransaction.description;
    this.txn_type = balanceTransaction.txn_type;
    this.created_at = balanceTransaction.created_at;
    this.available_on = balanceTransaction.available_on;
    this.updated_at = balanceTransaction.updated_at;
  }
};

exports.AccountStatus = AccountStatus;
exports.AccountType = AccountType;
exports.BankAccount = BankAccount;
exports.CaptureStrategy = CaptureStrategy;
exports.Checkout = Checkout;
exports.Completion = Completion;
exports.CompletionStatuses = CompletionStatuses;
exports.CurrencyTypes = CurrencyTypes;
exports.Dispute = Dispute;
exports.DisputeResponse = DisputeResponse;
exports.DisputeStatus = DisputeStatus;
exports.ICheckoutPaymentMode = ICheckoutPaymentMode;
exports.ICheckoutPaymentModeParam = ICheckoutPaymentModeParam;
exports.ICheckoutStatus = ICheckoutStatus;
exports.ITerminalStatus = ITerminalStatus;
exports.PAYMENT_METHOD_TYPES = PAYMENT_METHOD_TYPES;
exports.Payment = Payment;
exports.PaymentBalanceTransaction = PaymentBalanceTransaction;
exports.PaymentBalanceTxnType = PaymentBalanceTxnType;
exports.PaymentBankAccount = PaymentBankAccount;
exports.PaymentCard = PaymentCard;
exports.PaymentMethodData = PaymentMethodData;
exports.PaymentMethodTypes = PaymentMethodTypes;
exports.PaymentStatuses = PaymentStatuses;
exports.PaymentTypes = PaymentTypes;
exports.Payout = Payout;
exports.PayoutBalanceTransaction = PayoutBalanceTransaction;
exports.PayoutBalanceTransactionType = PayoutBalanceTransactionType;
exports.PayoutStatuses = PayoutStatuses;
exports.PayoutStatusesSafeNames = PayoutStatusesSafeNames;
exports.Refund = Refund;
exports.RefundPayload = RefundPayload;
exports.RefundReasons = RefundReasons;
exports.RefundStatuses = RefundStatuses;
exports.SubAccount = SubAccount;
exports.Terminal = Terminal;
exports.TerminalModel = TerminalModel;
exports.TerminalModelName = TerminalModelName;
exports.TerminalOrder = TerminalOrder;
exports.TerminalOrderStatus = TerminalOrderStatus;
exports.TerminalOrderType = TerminalOrderType;
exports.TerminalProviders = TerminalProviders;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map