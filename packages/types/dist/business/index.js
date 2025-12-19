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
function normalizeCountry(value) {
  const v = (value || "").toString().trim().toUpperCase();
  if (v === "US" || v === "USA" || v === "USA" /* USA */) return "USA" /* USA */;
  if (v === "CA" || v === "CAN" || v === "CAN" /* CAN */) return "CAN" /* CAN */;
  return "USA" /* USA */;
}

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

export { AdditionalQuestions, Address, Business, BusinessClassification, BusinessFormServerErrors, CoreBusinessInfo, EntityDocumentStatus, EntityDocumentType, Owner, Representative };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map