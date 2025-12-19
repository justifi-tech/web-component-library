'use strict';

// src/utils/country-codes.ts
var CountryCode = /* @__PURE__ */ ((CountryCode2) => {
  CountryCode2["USA"] = "USA";
  CountryCode2["CAN"] = "CAN";
  return CountryCode2;
})(CountryCode || {});

// src/utils/state-options.ts
var StateOptions = [
  {
    label: "Choose state",
    value: ""
  },
  {
    label: "Alabama",
    value: "AL"
  },
  {
    label: "Alaska",
    value: "AK"
  },
  {
    label: "American Samoa",
    value: "AS"
  },
  {
    label: "Arizona",
    value: "AZ"
  },
  {
    label: "Arkansas",
    value: "AR"
  },
  {
    label: "California",
    value: "CA"
  },
  {
    label: "Colorado",
    value: "CO"
  },
  {
    label: "Connecticut",
    value: "CT"
  },
  {
    label: "Delaware",
    value: "DE"
  },
  {
    label: "District Of Columbia",
    value: "DC"
  },
  {
    label: "Federated States Of Micronesia",
    value: "FM"
  },
  {
    label: "Florida",
    value: "FL"
  },
  {
    label: "Georgia",
    value: "GA"
  },
  {
    label: "Guam",
    value: "GU"
  },
  {
    label: "Hawaii",
    value: "HI"
  },
  {
    label: "Idaho",
    value: "ID"
  },
  {
    label: "Illinois",
    value: "IL"
  },
  {
    label: "Indiana",
    value: "IN"
  },
  {
    label: "Iowa",
    value: "IA"
  },
  {
    label: "Kansas",
    value: "KS"
  },
  {
    label: "Kentucky",
    value: "KY"
  },
  {
    label: "Louisiana",
    value: "LA"
  },
  {
    label: "Maine",
    value: "ME"
  },
  {
    label: "Marshall Islands",
    value: "MH"
  },
  {
    label: "Maryland",
    value: "MD"
  },
  {
    label: "Massachusetts",
    value: "MA"
  },
  {
    label: "Michigan",
    value: "MI"
  },
  {
    label: "Minnesota",
    value: "MN"
  },
  {
    label: "Mississippi",
    value: "MS"
  },
  {
    label: "Missouri",
    value: "MO"
  },
  {
    label: "Montana",
    value: "MT"
  },
  {
    label: "Nebraska",
    value: "NE"
  },
  {
    label: "Nevada",
    value: "NV"
  },
  {
    label: "New Hampshire",
    value: "NH"
  },
  {
    label: "New Jersey",
    value: "NJ"
  },
  {
    label: "New Mexico",
    value: "NM"
  },
  {
    label: "New York",
    value: "NY"
  },
  {
    label: "North Carolina",
    value: "NC"
  },
  {
    label: "North Dakota",
    value: "ND"
  },
  {
    label: "Northern Mariana Islands",
    value: "MP"
  },
  {
    label: "Ohio",
    value: "OH"
  },
  {
    label: "Oklahoma",
    value: "OK"
  },
  {
    label: "Oregon",
    value: "OR"
  },
  {
    label: "Palau",
    value: "PW"
  },
  {
    label: "Pennsylvania",
    value: "PA"
  },
  {
    label: "Puerto Rico",
    value: "PR"
  },
  {
    label: "Rhode Island",
    value: "RI"
  },
  {
    label: "South Carolina",
    value: "SC"
  },
  {
    label: "South Dakota",
    value: "SD"
  },
  {
    label: "Tennessee",
    value: "TN"
  },
  {
    label: "Texas",
    value: "TX"
  },
  {
    label: "Utah",
    value: "UT"
  },
  {
    label: "Vermont",
    value: "VT"
  },
  {
    label: "Virgin Islands",
    value: "VI"
  },
  {
    label: "Virginia",
    value: "VA"
  },
  {
    label: "Washington",
    value: "WA"
  },
  {
    label: "West Virginia",
    value: "WV"
  },
  {
    label: "Wisconsin",
    value: "WI"
  },
  {
    label: "Wyoming",
    value: "WY"
  }
];
var state_options_default = StateOptions;

// src/utils/helpers.ts
function getStateAbbreviation(stateName) {
  if (!stateName) return stateName;
  const state = state_options_default.find((s) => s.label === stateName);
  return state ? state.value : stateName;
}
function filterNumber(num) {
  if (!num) return "";
  if (/^\d$/.test(num)) {
    return "0" + num;
  }
  return num;
}
function constructDate(year, month, day) {
  if (!year || !month || !day) {
    return void 0;
  }
  return `${year}-${filterNumber(month)}-${filterNumber(day)}`;
}
function deconstructDate(formInput) {
  const dateString = formInput.value;
  const [dob_year, dob_month, dob_day] = dateString.split("-");
  return { dob_year, dob_month, dob_day };
}
function normalizeCountry(value) {
  const v = (value || "").toString().trim().toUpperCase();
  if (v === "US" || v === "USA" || v === "USA" /* USA */) return "USA" /* USA */;
  if (v === "CA" || v === "CAN" || v === "CAN" /* CAN */) return "CAN" /* CAN */;
  return "USA" /* USA */;
}

// src/api/Pagination.ts
var pagingDefaults = {
  amount: 25,
  start_cursor: "",
  end_cursor: "",
  has_previous: false,
  has_next: false
};
var ExtendedPagingDefaults = {
  ...pagingDefaults,
  handleClickNext: () => {
  },
  handleClickPrevious: () => {
  }
};

// src/business/Address.ts
var Address = class {
  constructor(address) {
    this.id = address.id;
    this.platform_account_id = address.platform_account_id;
    this.line1 = address.line1;
    this.line2 = address.line2;
    this.postal_code = address.postal_code;
    this.city = address.city;
    this.state = getStateAbbreviation(address.state);
    this.country = normalizeCountry(address.country);
    this.created_at = address.created_at;
    this.updated_at = address.updated_at;
  }
  get payload() {
    return {
      platform_account_id: this.platform_account_id || "",
      line1: this.line1 || "",
      line2: this.line2 || "",
      postal_code: this.postal_code || "",
      city: this.city || "",
      state: this.state || "",
      country: this.country || ""
    };
  }
};

// src/business/Document.ts
var EntityDocumentType = /* @__PURE__ */ ((EntityDocumentType2) => {
  EntityDocumentType2["voidedCheck"] = "voided_check";
  EntityDocumentType2["balanceSheet"] = "balance_sheet";
  EntityDocumentType2["bankStatement"] = "bank_statement";
  EntityDocumentType2["governmentId"] = "government_id";
  EntityDocumentType2["profitAndLossStatement"] = "profit_and_loss_statement";
  EntityDocumentType2["taxReturn"] = "tax_return";
  EntityDocumentType2["other"] = "other";
  return EntityDocumentType2;
})(EntityDocumentType || {});
var EntityDocumentStatus = /* @__PURE__ */ ((EntityDocumentStatus2) => {
  EntityDocumentStatus2["pending"] = "pending";
  EntityDocumentStatus2["uploaded"] = "uploaded";
  EntityDocumentStatus2["canceled"] = "canceled";
  EntityDocumentStatus2["needed"] = "needed";
  return EntityDocumentStatus2;
})(EntityDocumentStatus || {});

// src/business/Identity.ts
var Owner = class {
  constructor(owner) {
    this.address = { ...new Address(owner.address || {}) };
    this.created_at = owner.created_at;
    this.dob_day = filterNumber(owner.dob_day);
    this.dob_month = filterNumber(owner.dob_month);
    this.dob_year = owner.dob_year;
    this.dob_full = constructDate(this.dob_year, this.dob_month, this.dob_day) || "";
    this.documents = owner.documents;
    this.email = owner.email;
    this.id = owner.id;
    this.business_id = owner.business_id;
    this.is_owner = owner.is_owner;
    this.metadata = owner.metadata;
    this.name = owner.name;
    this.phone = owner.phone;
    this.platform_account_id = owner.platform_account_id;
    this.identification_number = owner.identification_number;
    this.ssn_last4 = owner.ssn_last4;
    this.title = owner.title;
    this.updated_at = owner.updated_at;
  }
  // Getter method to return the payload in the desired shape
  get payload() {
    return {
      address: new Address(this.address || {}).payload,
      dob_day: this.dob_day || "",
      dob_month: this.dob_month || "",
      dob_year: this.dob_year || "",
      email: this.email || "",
      identification_number: this.identification_number || void 0,
      is_owner: this.is_owner || false,
      metadata: this.metadata || null,
      name: this.name || "",
      phone: this.phone || "",
      platform_account_id: this.platform_account_id || null,
      title: this.title || ""
    };
  }
};
var Representative = class {
  constructor(representative) {
    this.address = { ...new Address(representative.address || {}) };
    this.created_at = representative.created_at;
    this.dob_day = filterNumber(representative.dob_day);
    this.dob_month = filterNumber(representative.dob_month);
    this.dob_year = representative.dob_year;
    this.dob_full = constructDate(this.dob_year, this.dob_month, this.dob_day) || "";
    this.documents = representative.documents;
    this.email = representative.email;
    this.id = representative.id;
    this.business_id = representative.business_id;
    this.is_owner = representative.is_owner;
    this.metadata = representative.metadata;
    this.name = representative.name;
    this.phone = representative.phone;
    this.platform_account_id = representative.platform_account_id;
    this.identification_number = representative.identification_number;
    this.ssn_last4 = representative.ssn_last4;
    this.title = representative.title;
    this.updated_at = representative.updated_at;
  }
  // Getter method to return the payload in the desired shape
  get payload() {
    return {
      address: new Address(this.address || {}).payload,
      dob_day: this.dob_day || "",
      dob_month: this.dob_month || "",
      dob_year: this.dob_year || "",
      email: this.email || "",
      is_owner: this.is_owner || false,
      identification_number: this.identification_number || void 0,
      metadata: this.metadata || null,
      name: this.name || "",
      phone: this.phone || "",
      platform_account_id: this.platform_account_id || null,
      title: this.title || ""
    };
  }
};

// src/business/Business.ts
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
var AdditionalQuestions = class {
  constructor(additionalQuestions) {
    this.business_revenue = additionalQuestions.business_revenue;
    this.business_payment_volume = additionalQuestions.business_payment_volume;
    this.business_when_service_received = additionalQuestions.business_when_service_received;
    this.business_recurring_payments = additionalQuestions.business_recurring_payments;
    this.business_recurring_payments_percentage = additionalQuestions.business_recurring_payments_percentage;
    this.business_seasonal = additionalQuestions.business_seasonal;
    this.business_other_payment_details = additionalQuestions.business_other_payment_details;
  }
  get payload() {
    return {
      business_revenue: this.business_revenue || "",
      business_payment_volume: this.business_payment_volume || "",
      business_when_service_received: this.business_when_service_received || "",
      business_recurring_payments: this.business_recurring_payments || "",
      business_recurring_payments_percentage: this.business_recurring_payments_percentage || "",
      business_seasonal: this.business_seasonal || "",
      business_other_payment_details: this.business_other_payment_details || ""
    };
  }
};
var CoreBusinessInfo = class {
  constructor(coreBusinessInfo) {
    this.classification = coreBusinessInfo.classification;
    this.legal_name = coreBusinessInfo.legal_name;
    this.doing_business_as = coreBusinessInfo.doing_business_as;
    this.industry = coreBusinessInfo.industry;
    this.tax_id = coreBusinessInfo.tax_id;
    this.tax_id_last4 = coreBusinessInfo.tax_id_last4;
    this.website_url = coreBusinessInfo.website_url;
    this.email = coreBusinessInfo.email;
    this.phone = coreBusinessInfo.phone;
    this.date_of_incorporation = coreBusinessInfo.date_of_incorporation;
  }
  get payload() {
    return {
      classification: this.classification || "",
      legal_name: this.legal_name || "",
      doing_business_as: this.doing_business_as || "",
      industry: this.industry || "",
      tax_id: this.tax_id || "",
      website_url: this.website_url || "",
      email: this.email || "",
      phone: this.phone || "",
      date_of_incorporation: this.date_of_incorporation || ""
    };
  }
};
var Business = class {
  constructor(business) {
    this.additional_questions = business.additional_questions ? new AdditionalQuestions(business.additional_questions) : null;
    this.associated_accounts = business.associated_accounts;
    this.classification = business.classification;
    this.bank_accounts = business.bank_accounts;
    this.created_at = business.created_at;
    this.documents = business.documents;
    this.doing_business_as = business.doing_business_as;
    this.email = business.email;
    this.id = business.id;
    this.industry = business.industry;
    this.legal_address = business?.legal_address ? new Address(business.legal_address) : null;
    this.legal_name = business.legal_name;
    this.metadata = business.metadata;
    this.owners = business.owners;
    this.phone = business.phone;
    this.platform_account_id = business.platform_account_id;
    this.product_categories = business.product_categories;
    this.representative = business.representative ? new Representative(business.representative) : null;
    this.tax_id = business.tax_id;
    this.tax_id_last4 = business.tax_id_last4;
    this.terms_conditions_accepted = business.terms_conditions_accepted;
    this.updated_at = business.updated_at;
    this.website_url = business.website_url;
    this.date_of_incorporation = business.date_of_incorporation;
    this.country_of_establishment = normalizeCountry(
      business.country_of_establishment
    );
  }
  get payload() {
    return {
      additional_questions: new AdditionalQuestions(this.additional_questions).payload,
      classification: this.classification || "",
      doing_business_as: this.doing_business_as || "",
      email: this.email || "",
      industry: this.industry || "",
      legal_address: new Address(this.legal_address || {}).payload,
      legal_name: this.legal_name || "",
      metadata: this.metadata || {},
      owners: this.owners.map((owner) => ({ id: owner.id })),
      phone: this.phone || "",
      platform_account_id: this.platform_account_id || "",
      representative: new Representative(
        this.representative || {}
      ).payload,
      tax_id: this.tax_id || "",
      tax_id_last4: this.tax_id_last4 || "",
      website_url: this.website_url || "",
      date_of_incorporation: this.date_of_incorporation || "",
      country_of_establishment: this.country_of_establishment || "USA" /* USA */
    };
  }
};

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
exports.AdditionalQuestions = AdditionalQuestions;
exports.Address = Address;
exports.BankAccount = BankAccount;
exports.Business = Business;
exports.BusinessClassification = BusinessClassification;
exports.BusinessFormServerErrors = BusinessFormServerErrors;
exports.CaptureStrategy = CaptureStrategy;
exports.Checkout = Checkout;
exports.Completion = Completion;
exports.CompletionStatuses = CompletionStatuses;
exports.CoreBusinessInfo = CoreBusinessInfo;
exports.CountryCode = CountryCode;
exports.CurrencyTypes = CurrencyTypes;
exports.Dispute = Dispute;
exports.DisputeResponse = DisputeResponse;
exports.DisputeStatus = DisputeStatus;
exports.EntityDocumentStatus = EntityDocumentStatus;
exports.EntityDocumentType = EntityDocumentType;
exports.ExtendedPagingDefaults = ExtendedPagingDefaults;
exports.ICheckoutPaymentMode = ICheckoutPaymentMode;
exports.ICheckoutPaymentModeParam = ICheckoutPaymentModeParam;
exports.ICheckoutStatus = ICheckoutStatus;
exports.ITerminalStatus = ITerminalStatus;
exports.Owner = Owner;
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
exports.Representative = Representative;
exports.StateOptions = state_options_default;
exports.SubAccount = SubAccount;
exports.Terminal = Terminal;
exports.TerminalModel = TerminalModel;
exports.TerminalModelName = TerminalModelName;
exports.TerminalOrder = TerminalOrder;
exports.TerminalOrderStatus = TerminalOrderStatus;
exports.TerminalOrderType = TerminalOrderType;
exports.TerminalProviders = TerminalProviders;
exports.constructDate = constructDate;
exports.deconstructDate = deconstructDate;
exports.filterNumber = filterNumber;
exports.getStateAbbreviation = getStateAbbreviation;
exports.normalizeCountry = normalizeCountry;
exports.pagingDefaults = pagingDefaults;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map