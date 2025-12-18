/**
 * @justifi/types - Shared TypeScript type definitions for JustiFi
 * This package contains only pure type definitions (interfaces, types, enums).
 * Runtime classes and utilities remain in @justifi/webcomponents.
 */
declare enum CountryCode {
    USA = "USA",
    CAN = "CAN"
}
interface IApiResponse<T> {
    data: T;
    error?: IErrorObject | IServerError;
    page_info?: PagingInfo;
    errors?: string[];
    id: number | string;
    type: string;
}
type IServerError = string;
interface IErrorObject {
    message: string;
    code: string;
    param?: string;
}
interface IApiResponseCollection<T> extends IApiResponse<T> {
    page_info: PagingInfo;
}
interface PagingInfo {
    has_previous: boolean;
    has_next: boolean;
    start_cursor: string;
    end_cursor: string;
}
interface ExtendedPagingInfo extends PagingInfo {
    total_page_count: number;
    current_page: number;
}
interface ExtendedPagingDefaults {
    pageSize: number;
    pageSizeMenu: number[];
}
declare enum CaptureStrategy {
    automatic = "automatic",
    manual = "manual"
}
declare enum PaymentMethodTypes {
    card = "card",
    bankAccount = "bankAccount",
    sezzle = "sezzle",
    plaid = "plaid",
    applePay = "applePay"
}
declare enum PaymentTypes {
    card = "Card",
    bankAccount = "ACH",
    unknown = "Unknown"
}
declare enum PaymentStatuses {
    pending = "pending",
    automatic = "automatic",
    authorized = "authorized",
    succeeded = "succeeded",
    failed = "failed",
    canceled = "canceled",
    disputed = "disputed",
    fully_refunded = "fully_refunded",
    partially_refunded = "partially_refunded"
}
declare enum CurrencyTypes {
    usd = "usd",
    cad = "cad"
}
type CardBrand = 'american_express' | 'diners_club' | 'discover' | 'jcb' | 'mastercard' | 'china_unionpay' | 'visa' | 'unknown';
type AccountType = 'checking' | 'savings';
interface ICard {
    id: string;
    acct_last_four: string;
    name: string;
    brand: CardBrand;
    token: string;
    created_at: string;
    updated_at: string;
}
interface IBankAccount {
    id: string;
    acct_last_four: string;
    name: string;
    brand: string;
    token: string;
    created_at: string;
    updated_at: string;
}
interface IPaymentMethod {
    card?: ICard;
    bank_account?: IBankAccount;
}
interface IPaymentMethodMetadata {
    card?: ICard;
    bankAccount?: IBankAccount;
}
interface IPaymentDispute {
    amount_cents: number;
    created_at: string;
    currency: CurrencyTypes;
    gateway_ref_id: string;
    id: string;
    payment_id: string;
    reason: null;
    status: string;
    updated_at: string;
}
interface IApplicationFee {
    id: string;
    amount: number;
    currency: CurrencyTypes;
    created_at: string;
    updated_at: string;
}
interface IPayment {
    id: string;
    account_id: string;
    amount: number;
    amount_disputed: number;
    amount_refundable: number;
    amount_refunded: number;
    amount_returned?: number;
    balance: number;
    captured: boolean;
    capture_strategy: CaptureStrategy;
    currency: CurrencyTypes;
    description: string;
    disputed: boolean;
    disputes: IPaymentDispute[];
    error_code: string | null;
    error_description: string | null;
    expedited?: boolean;
    fee_amount: number;
    is_test: boolean;
    metadata: object | null;
    payment_method: IPaymentMethod;
    payment_intent_id?: string | null;
    refunded: boolean;
    status: PaymentStatuses;
    created_at: string;
    updated_at: string;
    financial_transaction_id: string;
    returned: boolean;
    application_fee: IApplicationFee;
    application_fee_rate_id?: string;
    refunds: IRefund[];
    transaction_hold?: null;
    statement_descriptor?: string;
}
interface PaymentsQueryParams {
    payment_id?: string;
    terminal_id?: string;
    payment_status?: PaymentStatuses;
    created_after?: string;
    created_before?: string;
}
declare enum RefundStatus {
    pending = "pending",
    succeeded = "succeeded",
    failed = "failed"
}
interface IRefund {
    id: string;
    payment_id: string;
    amount: number;
    description: string;
    reason: string | null;
    status: RefundStatus;
    metadata: object | null;
    created_at: string;
    updated_at: string;
}
interface IBnpl {
    provider: string;
    provider_client_id: string;
    provider_mode: string;
    provider_checkout_url: string;
    provider_order_id: string;
    provider_api_version: string;
}
declare enum ICheckoutPaymentMode {
    bnpl = "Buy Now Pay Later",
    ecom = "E-commerce",
    card = "Card",
    bank_account = "Bank Account",
    card_present = "Card Present",
    apple_pay = "Apple Pay",
    unknown = ""
}
declare enum ICheckoutPaymentModeParam {
    bnpl = "bnpl",
    ecom = "ecom",
    apple_pay = "apple_pay"
}
declare enum ICheckoutStatus {
    created = "created",
    completed = "completed",
    attempted = "attempted",
    expired = "expired"
}
declare enum CompletionStatuses {
    failed = "failed",
    succeeded = "succeeded"
}
interface ICompletion {
    payment_mode?: ICheckoutPaymentMode;
    payment_token?: string | null;
    payment_status?: string | null;
    payment_response?: any;
    payment_error_code?: string | null;
    payment_error_description?: string | null;
    checkout_id?: string;
    additional_transactions?: any[];
    payment_id?: string;
    payment_method_id?: string;
    status?: string;
    created_at: string;
    updated_at: string;
}
interface ICheckoutPaymentSettings {
    ach_payments: boolean;
    bnpl_payments: boolean;
    credit_card_payments: boolean;
    insurance_payments?: boolean;
    bank_account_verification?: boolean;
    apple_payments?: boolean;
    google_payments?: boolean;
}
interface ICheckout {
    id: string;
    description: string;
    payment_intent_id: string;
    account_id: string;
    platform_account_id: string;
    payment_amount: number;
    payment_client_id: string;
    payment_description: string;
    payment_methods: ICheckoutPaymentMethod[];
    payment_method_group_id: string;
    payment_settings: ICheckoutPaymentSettings;
    bnpl?: IBnpl;
    total_amount: number;
    insurance_amount: number;
    status: ICheckoutStatus;
    payment_currency?: CurrencyTypes;
    mode?: string | null;
    statement_descriptor?: string | null;
    application_fees?: any[] | null;
    successful_payment_id?: string | null;
    created_at: string;
    updated_at: string;
    completions?: ICompletion[];
}
interface ICheckoutPaymentMethod {
    id: string;
    type: string;
    status: string;
    invalid_reason: null;
    name: string;
    brand: CardBrand;
    acct_last_four: string;
    account_type: AccountType;
    month: string;
    year: string;
    address_line1_check: string;
    address_postal_code_check: string;
    bin_details: null;
}
type ICheckoutCompleteResponse = IApiResponse<{
    payment_mode: ICheckoutPaymentMode;
    payment_token: null;
    payment_status: string;
    payment_response: null;
    checkout_id: string;
    additional_transactions: any[];
    checkout: ICheckout;
}>;
type ILoadedEventResponse = {
    checkout_status: ICheckoutStatus;
};
interface CheckoutsQueryParams {
    status?: ICheckoutStatus;
    payment_mode?: ICheckoutPaymentMode;
    checkout_id?: string;
    created_after?: string;
    created_before?: string;
}
declare enum BusinessFormServerErrors {
    fetchData = "Error retrieving business data",
    patchData = "Error updating business data"
}
declare enum BusinessClassification {
    sole_proprietor = "sole_proprietor",
    partnership = "partnership",
    corporation = "corporation",
    public_company = "public_company",
    limited = "limited",
    non_profit = "non_profit",
    government = "government"
}
interface IAddress {
    id?: string;
    platform_account_id?: string;
    line1?: string;
    line2?: string;
    postal_code?: string;
    city?: string;
    state?: string;
    country?: string;
    created_at?: string;
    updated_at?: string;
}
interface ProductCategories {
    credit: boolean;
    insurance: boolean;
    lending: boolean;
    payment: boolean;
}
interface IAdditionalQuestions {
    business_revenue?: string;
    business_payment_volume?: string;
    business_when_service_received?: string;
    business_recurring_payments?: string;
    business_recurring_payments_percentage?: string;
    business_seasonal?: string;
    business_other_payment_details?: string;
    payload?: any;
}
interface ICoreBusinessInfo {
    classification?: BusinessClassification;
    legal_name?: string;
    doing_business_as?: string;
    industry?: string;
    tax_id?: string;
    tax_id_last4?: string;
    website_url?: string;
    email?: string;
    phone?: string;
    date_of_incorporation?: string;
}
interface IBusiness {
    additional_questions: IAdditionalQuestions;
    associated_accounts: any[];
    classification: BusinessClassification;
    bank_accounts: IBankAccount[];
    created_at: string;
    documents: IDocument[];
    doing_business_as: string;
    email: string;
    id: string;
    industry: string;
    legal_address?: IAddress | null;
    legal_name: string;
    metadata: any;
    owners: IIdentity[];
    phone: string;
    platform_account_id: string;
    product_categories: ProductCategories;
    representative?: IIdentity | null;
    tax_id: string;
    tax_id_last4: string;
    terms_conditions_accepted: boolean;
    updated_at: string;
    website_url: string;
    date_of_incorporation?: string;
    country_of_establishment?: CountryCode;
}
interface IProductReadiness {
    business_id: string;
    created_at: string;
    id: string;
    last_verified_at: string;
    missing_optional_fields: string[];
    missing_required_fields: string[];
    percentage_complete: number;
    percentage_ready: number;
    platform_account_id: string;
    product_category: string;
    product_name: string;
    required_ready: boolean;
    updated_at: string;
}
interface IIdentity {
    id?: string;
    platform_account_id?: string;
    name?: string;
    title?: string;
    email?: string;
    phone?: string;
    dob_day?: string;
    dob_month?: string;
    dob_year?: string;
    identification_number?: string;
    is_owner?: boolean;
    metadata?: any;
    created_at?: string;
    updated_at?: string;
    address?: IAddress | null;
    ssn_last4?: string;
    documents?: IDocument[];
}
interface IRepresentative extends IIdentity {
}
declare enum EntityDocumentType {
    voided_check = "voided_check",
    bank_statement = "bank_statement",
    government_id_front = "government_id_front",
    government_id_back = "government_id_back",
    ss4_form = "ss4_form",
    balance_sheet = "balance_sheet",
    articles_of_incorporation = "articles_of_incorporation"
}
interface IDocument {
    id: string;
    document_type: EntityDocumentType;
    file_name: string;
    file_type: string;
    status: string;
    description: string;
    business_id: string;
    identity_id: string;
    presigned_url: string;
    created_at: string;
    updated_at: string;
}
interface FileSelectEvent {
    file: File;
    documentType: EntityDocumentType;
}
declare enum DisputeStatus {
    needs_response = "needs_response",
    under_review = "under_review",
    won = "won",
    lost = "lost"
}
declare enum DisputeEvidenceStatus {
    pending_response = "pending_response",
    submitted = "submitted"
}
interface IDispute {
    id: string;
    payment_id: string;
    amount: number;
    currency: CurrencyTypes;
    reason: string | null;
    status: DisputeStatus;
    respond_by: string | null;
    created_at: string;
    updated_at: string;
    metadata: object | null;
}
interface DisputeResponse {
    cancellation_policy: string;
    cancellation_policy_disclosure: string;
    cancellation_rebuttal: string;
    customer_communication: string;
    customer_email_address: string;
    customer_name: string;
    customer_purchase_ip: string;
    customer_signature: string;
    duplicate_charge_documentation: string;
    duplicate_charge_explanation: string;
    duplicate_charge_id: string;
    product_description: string;
    receipt: string;
    refund_policy: string;
    refund_policy_disclosure: string;
    refund_refusal_explanation: string;
    service_date: string;
    service_documentation: string;
    shipping_address: string;
    shipping_carrier: string;
    shipping_date: string;
    shipping_documentation: string;
    shipping_tracking_number: string;
    uncategorized_file: string;
    uncategorized_text: string;
}
declare enum DisputeEvidenceDocumentType {
    cancellation_policy = "cancellation_policy",
    customer_communication = "customer_communication",
    customer_signature = "customer_signature",
    duplicate_charge_documentation = "duplicate_charge_documentation",
    receipt = "receipt",
    refund_policy = "refund_policy",
    service_documentation = "service_documentation",
    shipping_documentation = "shipping_documentation",
    uncategorized_file = "uncategorized_file"
}
interface DisputeEvidenceDocument {
    id: string;
    dispute_id: string;
    document_type: DisputeEvidenceDocumentType;
    file_name: string;
    file_type: string;
    presigned_url: string;
    created_at: string;
    updated_at: string;
}
declare enum PayoutStatus {
    pending = "pending",
    in_transit = "in_transit",
    paid = "paid",
    canceled = "canceled",
    failed = "failed",
    forwarded = "forwarded",
    scheduled = "scheduled"
}
interface IPayout {
    id: string;
    account_id: string;
    amount: number;
    bank_account: IBankAccount;
    currency: CurrencyTypes;
    delivery_method: string;
    description: string;
    deposits_at: string | null;
    fees_total: number;
    metadata: object | null;
    payments_total: number;
    refunds_total: number;
    other_total: number;
    status: PayoutStatus;
    created_at: string;
    updated_at: string;
}
interface IPaymentBalanceTransaction {
    id: string;
    payment_id: string;
    payout_id: string;
    amount: number;
    fee_amount: number;
    financial_transaction_id: string;
    currency: CurrencyTypes;
    created_at: string;
    updated_at: string;
}
interface IPayoutBalanceTransaction {
    id: string;
    payout_id: string;
    amount: number;
    fee_amount: number;
    currency: CurrencyTypes;
    source_type: string;
    source_id: string;
    created_at: string;
    updated_at: string;
}
declare enum SubAccountStatus {
    created = "created",
    submitted = "submitted",
    information_needed = "information_needed",
    enabled = "enabled",
    disabled = "disabled",
    rejected = "rejected",
    archived = "archived"
}
interface ISubAccount {
    id: string;
    account_type: string;
    name: string;
    status: SubAccountStatus;
    currency: CurrencyTypes;
    platform_account_id: string;
    created_at: string;
    updated_at: string;
}
declare enum TerminalStatus {
    connected = "connected",
    disconnected = "disconnected",
    unknown = "unknown"
}
interface ITerminal {
    id: string;
    account_id: string;
    nickname: string;
    status: TerminalStatus;
    provider_id: string;
    provider: string;
    created_at: string;
    updated_at: string;
}
declare enum TerminalModelName {
    bbpos_chipper_2x = "bbpos_chipper_2x",
    pax_a920_pro = "pax_a920_pro",
    verifone_P400 = "verifone_P400",
    stripe_s700 = "stripe_s700",
    bbpos_wisepos_e = "bbpos_wisepos_e"
}
declare enum TerminalOrderStatus {
    submitted = "submitted",
    processing = "processing",
    cancelled = "cancelled",
    shipped = "shipped",
    delivered = "delivered",
    unknown = "unknown"
}
declare enum TerminalOrderType {
    purchase = "purchase",
    return = "return"
}
interface ITerminalOrder {
    id: string;
    account_id: string;
    business_id: string;
    terminal_model_id: string;
    shipping_address: IAddress;
    quantity: number;
    status: TerminalOrderStatus;
    order_type: TerminalOrderType;
    tracking_number: string | null;
    created_at: string;
    updated_at: string;
}
interface GrossVolumeReportDate {
    date: string;
    value: number;
}
interface GrossVolumeReport {
    current: GrossVolumeReportDate[];
    previous: GrossVolumeReportDate[];
    currency: CurrencyTypes;
}
interface IBillingInfo {
    name?: string;
    address_line1?: string;
    address_line2?: string;
    address_city?: string;
    address_state?: string;
    address_postal_code?: string;
    address_country?: string;
}
declare enum ApplePaySessionStatus {
    STATUS_SUCCESS = 0,
    STATUS_FAILURE = 1,
    STATUS_INVALID_BILLING_POSTAL_ADDRESS = 2,
    STATUS_INVALID_SHIPPING_POSTAL_ADDRESS = 3,
    STATUS_INVALID_SHIPPING_CONTACT = 4,
    STATUS_PIN_REQUIRED = 5,
    STATUS_PIN_INCORRECT = 6,
    STATUS_PIN_LOCKOUT = 7
}
declare enum ApplePayButtonType {
    PLAIN = "plain",
    BUY = "buy",
    DONATE = "donate"
}
declare enum ApplePayButtonStyle {
    BLACK = "black",
    WHITE = "white",
    WHITE_OUTLINE = "white-outline"
}
declare enum ApplePayMerchantCapability {
    SUPPORTS_3DS = "supports3DS",
    SUPPORTS_CREDIT = "supportsCredit",
    SUPPORTS_DEBIT = "supportsDebit",
    SUPPORTS_EMV = "supportsEMV"
}
interface IApplePayLineItem {
    label: string;
    amount: string;
    type?: 'final' | 'pending';
}
interface IApplePayShippingMethod {
    label: string;
    detail: string;
    amount: string;
    identifier: string;
}
interface IApplePayPaymentRequest {
    countryCode: string;
    currencyCode: string;
    merchantCapabilities: ApplePayMerchantCapability[];
    supportedNetworks: string[];
    total: IApplePayLineItem;
    lineItems?: IApplePayLineItem[];
    shippingMethods?: IApplePayShippingMethod[];
    requiredBillingContactFields?: string[];
    requiredShippingContactFields?: string[];
}
interface IApplePayConfig {
    merchantIdentifier: string;
    displayName: string;
    initiative?: string;
    initiativeContext?: string;
}
interface IApplePayError {
    code: string;
    message: string;
}
interface IMerchantSession {
    epochTimestamp: number;
    expiresAt: number;
    merchantSessionIdentifier: string;
    nonce: string;
    merchantIdentifier: string;
    domainName: string;
    displayName: string;
    signature: string;
}
interface IApplePayTokenPaymentData {
    data: string;
    signature: string;
    header: {
        ephemeralPublicKey: string;
        publicKeyHash: string;
        transactionId: string;
    };
    version: string;
}
interface IApplePayTokenPaymentMethod {
    displayName: string;
    network: string;
    type: string;
}
interface IApplePayToken {
    paymentData: IApplePayTokenPaymentData;
    paymentMethod: IApplePayTokenPaymentMethod;
    transactionIdentifier: string;
}
interface IApplePaySession {
    begin: () => void;
    abort: () => void;
    completeMerchantValidation: (merchantSession: IMerchantSession) => void;
    completePayment: (result: {
        status: ApplePaySessionStatus;
    }) => void;
    completePaymentMethodSelection: (update: {
        newTotal: IApplePayLineItem;
        newLineItems?: IApplePayLineItem[];
    }) => void;
    completeShippingMethodSelection: (update: {
        status: ApplePaySessionStatus;
        newTotal: IApplePayLineItem;
        newLineItems?: IApplePayLineItem[];
    }) => void;
    onvalidatemerchant: ((event: any) => void) | null;
    onpaymentauthorized: ((event: any) => void) | null;
    onpaymentmethodselected: ((event: any) => void) | null;
    onshippingmethodselected: ((event: any) => void) | null;
    oncancel: ((event: IApplePayCancelEvent) => void) | null;
}
interface IApplePayCancelEvent {
    sessionError?: {
        code: string;
        message?: string;
    };
}
interface IApplePayPaymentProcessRequest {
    paymentData: IApplePayTokenPaymentData;
    paymentMethod: IApplePayTokenPaymentMethod;
    transactionIdentifier: string;
    product_details: {
        name: string;
        price: number;
        description: string;
    };
}
interface IApplePayPaymentResponse {
    id: string;
    data: {
        token: string;
    };
}
interface IApplePayService {
    initialize(config: IApplePayConfig): void;
    isAvailable(): boolean;
    canMakePaymentsWithActiveCard(): Promise<boolean>;
    startPaymentSession(paymentRequest: IApplePayPaymentRequest, authToken: string, accountId: string): Promise<{
        success: boolean;
        token?: IApplePayToken;
        paymentMethodId?: string;
        error?: IApplePayError;
    }>;
    abortPaymentSession(): void;
}
declare enum GooglePayButtonSizeMode {
    STATIC = "static",
    FILL = "fill"
}
declare enum GooglePayButtonStyle {
    BLACK = "black",
    WHITE = "white"
}
declare enum GooglePayButtonType {
    BOOK = "book",
    BUY = "buy",
    CHECKOUT = "checkout",
    DONATE = "donate",
    ORDER = "order",
    PAY = "pay",
    PLAIN = "plain",
    SUBSCRIBE = "subscribe"
}
declare enum GooglePayEnvironment {
    TEST = "TEST",
    PRODUCTION = "PRODUCTION"
}
interface IGooglePayError {
    code: string;
    message: string;
}
interface IGooglePayTransactionInfo {
    countryCode: string;
    currencyCode: string;
    totalPriceStatus: 'FINAL' | 'ESTIMATED' | 'NOT_CURRENTLY_KNOWN';
    totalPrice: string;
    totalPriceLabel?: string;
}
interface IGooglePayMerchantInfo {
    merchantName: string;
    merchantId: string;
}
interface IGooglePayPaymentMethodData {
    type: string;
    parameters: {
        allowedAuthMethods: string[];
        allowedCardNetworks: string[];
        billingAddressRequired?: boolean;
        billingAddressParameters?: {
            format?: string;
            phoneNumberRequired?: boolean;
        };
    };
    tokenizationSpecification: {
        type: string;
        parameters: {
            gateway: string;
            gatewayMerchantId: string;
        };
    };
}
interface IGooglePayPaymentDataRequest {
    apiVersion: number;
    apiVersionMinor: number;
    allowedPaymentMethods: IGooglePayPaymentMethodData[];
    transactionInfo: IGooglePayTransactionInfo;
    merchantInfo: IGooglePayMerchantInfo;
    emailRequired?: boolean;
    shippingAddressRequired?: boolean;
    shippingOptionRequired?: boolean;
}
interface IGooglePayPaymentData {
    apiVersion: number;
    apiVersionMinor: number;
    paymentMethodData: {
        type: string;
        description: string;
        info: {
            cardNetwork: string;
            cardDetails: string;
            billingAddress?: any;
        };
        tokenizationData: {
            type: string;
            token: string;
        };
    };
    email?: string;
    shippingAddress?: any;
}
interface IGooglePayConfig {
    environment: GooglePayEnvironment;
    merchantId: string;
    merchantName: string;
    gatewayMerchantId: string;
}
interface IGooglePayTokenProcessRequest {
    protocolVersion: string;
    signature: string;
    intermediateSigningKey?: {
        signedKey: string;
        signatures: string[];
    };
    signedMessage: string;
}
interface IGooglePayTokenResponse {
    id: string;
    data: {
        token: string;
    };
}
interface IGooglePayClient {
    isReadyToPay(request: any): Promise<{
        result: boolean;
    }>;
    loadPaymentData(request: any): Promise<IGooglePayPaymentData>;
    createButton(options: {
        onClick: () => void;
        buttonType?: string;
        buttonSizeMode?: string;
        buttonColor?: string;
        buttonLocale?: string;
    }): HTMLElement;
    prefetchPaymentData(request: any): void;
}
interface IGooglePayService {
    initialize(config: IGooglePayConfig): void;
    isAvailable(): boolean;
    canMakePayments(): Promise<boolean>;
    startPaymentSession(paymentDataRequest: IGooglePayPaymentDataRequest, authToken: string, accountId: string): Promise<{
        success: boolean;
        paymentData?: IGooglePayPaymentData;
        paymentMethodId?: string;
        error?: IGooglePayError;
    }>;
}
interface ComponentClickEvent {
    name: string;
    data?: any;
}
interface ComponentErrorEvent {
    errorCode: string;
    message: string;
    severity: string;
}
interface ComponentFormStepCompleteEvent {
    step: string;
    data?: any;
}
interface ComponentSubmitEvent {
    response?: any;
    error?: any;
}
interface RecordClickEvent {
    entityType: string;
    entity: any;
}

export { type AccountType, ApplePayButtonStyle, ApplePayButtonType, ApplePayMerchantCapability, ApplePaySessionStatus, BusinessClassification, BusinessFormServerErrors, CaptureStrategy, type CardBrand, type CheckoutsQueryParams, CompletionStatuses, type ComponentClickEvent, type ComponentErrorEvent, type ComponentFormStepCompleteEvent, type ComponentSubmitEvent, CountryCode, CurrencyTypes, type DisputeEvidenceDocument, DisputeEvidenceDocumentType, DisputeEvidenceStatus, type DisputeResponse, DisputeStatus, EntityDocumentType, type ExtendedPagingDefaults, type ExtendedPagingInfo, type FileSelectEvent, GooglePayButtonSizeMode, GooglePayButtonStyle, GooglePayButtonType, GooglePayEnvironment, type GrossVolumeReport, type GrossVolumeReportDate, type IAdditionalQuestions, type IAddress, type IApiResponse, type IApiResponseCollection, type IApplePayCancelEvent, type IApplePayConfig, type IApplePayError, type IApplePayLineItem, type IApplePayPaymentProcessRequest, type IApplePayPaymentRequest, type IApplePayPaymentResponse, type IApplePayService, type IApplePaySession, type IApplePayShippingMethod, type IApplePayToken, type IApplePayTokenPaymentData, type IApplePayTokenPaymentMethod, type IApplicationFee, type IBankAccount, type IBillingInfo, type IBnpl, type IBusiness, type ICard, type ICheckout, type ICheckoutCompleteResponse, type ICheckoutPaymentMethod, ICheckoutPaymentMode, ICheckoutPaymentModeParam, type ICheckoutPaymentSettings, ICheckoutStatus, type ICompletion, type ICoreBusinessInfo, type IDispute, type IDocument, type IErrorObject, type IGooglePayClient, type IGooglePayConfig, type IGooglePayError, type IGooglePayMerchantInfo, type IGooglePayPaymentData, type IGooglePayPaymentDataRequest, type IGooglePayPaymentMethodData, type IGooglePayService, type IGooglePayTokenProcessRequest, type IGooglePayTokenResponse, type IGooglePayTransactionInfo, type IIdentity, type ILoadedEventResponse, type IMerchantSession, type IPayment, type IPaymentBalanceTransaction, type IPaymentDispute, type IPaymentMethod, type IPaymentMethodMetadata, type IPayout, type IPayoutBalanceTransaction, type IProductReadiness, type IRefund, type IRepresentative, type IServerError, type ISubAccount, type ITerminal, type ITerminalOrder, type PagingInfo, PaymentMethodTypes, PaymentStatuses, PaymentTypes, type PaymentsQueryParams, PayoutStatus, type ProductCategories, type RecordClickEvent, RefundStatus, SubAccountStatus, TerminalModelName, TerminalOrderStatus, TerminalOrderType, TerminalStatus };
