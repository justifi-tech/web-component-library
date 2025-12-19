import { I as IBankAccount } from '../BankAccount-CefqeO4K.cjs';
export { B as BankAccount } from '../BankAccount-CefqeO4K.cjs';
import { I as IApiResponse } from '../Api-cjOPCGae.cjs';

declare enum DisputeStatus {
    won = "won",
    lost = "lost",
    underReview = "under_review",
    needsResponse = "needs_response"
}
interface IDispute {
    id: string;
    amount: number;
    currency: string;
    payment_id: string;
    reason: string;
    due_date: string;
    status: DisputeStatus;
    metadata: unknown;
    created_at: string;
    updated_at: string;
    dispute_response?: IDisputeResponse;
}
declare class Dispute implements IDispute {
    id: string;
    amount: number;
    currency: string;
    payment_id: string;
    reason: string;
    due_date: string;
    status: DisputeStatus;
    metadata: unknown;
    created_at: string;
    updated_at: string;
    dispute_response?: DisputeResponse;
    get needsResponse(): boolean;
    get underReview(): boolean;
    get won(): boolean;
    get lost(): boolean;
    constructor(dispute: IDispute);
}
interface IDisputeResponse {
    additional_statement: string;
    cancellation_policy_disclosure: string;
    cancellation_rebuttal: string;
    customer_billing_address: string;
    customer_email_address: string;
    customer_name: string;
    customer_purchase_ip_address: string;
    duplicate_charge_explanation: string;
    product_description: string;
    refund_policy_disclosure: string;
    refund_refusal_explanation: string;
    service_date: string;
    shipping_address: string;
    shipping_carrier: string;
    shipping_date: string;
    shipping_tracking_number: string;
    duplicate_charge_original_payment_id: string;
}
declare class DisputeResponse implements IDisputeResponse {
    additional_statement: string;
    cancellation_policy_disclosure: string;
    cancellation_rebuttal: string;
    customer_billing_address: string;
    customer_email_address: string;
    customer_name: string;
    customer_purchase_ip_address: string;
    duplicate_charge_explanation: string;
    product_description: string;
    refund_policy_disclosure: string;
    refund_refusal_explanation: string;
    service_date: string;
    shipping_address: string;
    shipping_carrier: string;
    shipping_date: string;
    shipping_tracking_number: string;
    duplicate_charge_original_payment_id: string;
    constructor(response: IDisputeResponse);
}

declare enum RefundStatuses {
    succeeded = "succeeded",
    failed = "failed"
}
declare enum RefundReasons {
    customerRequest = "customer_request",
    duplicate = "duplicate",
    fraudulent = "fraudulent"
}
interface IRefundPayload {
    amount?: number;
    reason?: RefundReasons;
    description?: string;
    metadata?: unknown;
}
declare class RefundPayload implements IRefundPayload {
    amount?: number;
    reason?: RefundReasons;
    description?: string;
    metadata?: unknown;
    constructor(refundPayload: IRefundPayload);
}
interface IRefund {
    amount: number;
    created_at: string;
    description: string;
    id: string;
    metadata: object | null;
    payment_id: string;
    reason: RefundReasons | null;
    status: RefundStatuses;
    updated_at: string;
}
declare class Refund implements IRefund {
    amount: number;
    created_at: string;
    description: string;
    id: string;
    metadata: object | null;
    payment_id: string;
    reason: RefundReasons | null;
    status: RefundStatuses;
    updated_at: string;
    constructor(refund: IRefund);
}

declare enum AccountType {
    test = "test",
    live = "live"
}
declare enum AccountStatus {
    created = "created",
    submitted = "submitted",
    information_needed = "information_needed",
    rejected = "rejected",
    enabled = "enabled",
    disabled = "disabled",
    archived = "archived"
}
interface RelatedAccounts {
    live_account_id: string;
    test_account_id: string;
}
interface ISubAccount {
    id: string;
    name: string;
    account_type: AccountType;
    status: AccountStatus;
    currency: string;
    platform_account_id: string;
    payout_account_id: string;
    business_id: string;
    application_fee_rates: unknown[];
    processing_ready: boolean;
    payout_ready: boolean;
    related_accounts: RelatedAccounts;
    created_at: string;
    updated_at: string;
}
declare class SubAccount implements ISubAccount {
    id: string;
    name: string;
    account_type: AccountType;
    status: AccountStatus;
    currency: string;
    platform_account_id: string;
    payout_account_id: string;
    business_id: string;
    application_fee_rates: unknown[];
    processing_ready: boolean;
    payout_ready: boolean;
    related_accounts: RelatedAccounts;
    created_at: string;
    updated_at: string;
    constructor(subAccount: ISubAccount);
}

declare enum TerminalModelName {
    v400 = "v400",
    p400 = "p400+",
    e285 = "e285"
}
interface ITerminalModel {
    id: string;
    model_name: TerminalModelName;
    description: string;
    image_url: string;
    help_url: string;
}
interface ITerminalModelApiResponse {
    id: string;
    model_name: TerminalModelName;
    description: string;
    image_url: string;
    help_url: string;
}
interface ITerminalModelsApiResponse {
    terminal_models: ITerminalModelApiResponse[];
    order_limit: number;
}
declare class TerminalModel implements ITerminalModel {
    id: string;
    model_name: TerminalModelName;
    description: string;
    image_url: string;
    help_url: string;
    constructor(data: ITerminalModelApiResponse);
}

interface TerminalsQueryParams {
    terminal_id?: string;
    terminal_order_id?: string;
    status?: string;
}
declare enum ITerminalStatus {
    connected = "connected",
    disconnected = "disconnected",
    unknown = "unknown",
    pending_configuration = "pending_configuration",
    archived = "archived"
}
interface ITerminal {
    id?: string | null;
    status?: ITerminalStatus;
    account_id?: string | null;
    platform_account_id?: string | null;
    gateway_ref_id?: string | null;
    provider?: TerminalProviders | null;
    provider_id?: string | null;
    provider_serial_number?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    verified_at?: string | null;
    nickname?: string | null;
    model_name?: TerminalModelName | null;
}
declare enum TerminalProviders {
    verifone = "verifone"
}
declare class Terminal implements ITerminal {
    id: string;
    status?: ITerminalStatus;
    account_id: string;
    platform_account_id: string;
    provider?: TerminalProviders;
    provider_id: string;
    provider_serial_number: string;
    created_at: string;
    updated_at: string;
    verified_at: string;
    nickname: string;
    sub_account_name?: string;
    model_name?: TerminalModelName;
    constructor(data: ITerminal);
}

interface TerminalOrderQueryParams {
    order_status?: TerminalOrderStatus;
    order_type?: TerminalOrderType;
    created_after?: string;
    created_before?: string;
}
declare enum TerminalOrderType {
    boardingOnly = "boarding_only",
    boardingShipping = "boarding_shipping"
}
declare enum TerminalOrderStatus {
    created = "created",
    submitted = "submitted",
    completed = "completed",
    in_progress = "in_progress",
    on_hold = "on_hold",
    canceled = "canceled"
}
interface OrderedTerminal {
    terminal_id: string;
    terminal_did: string;
    model_name: TerminalModelName;
}
interface TerminalOrderItem {
    model_name: TerminalModelName;
    quantity: number;
}
interface ITerminalOrder {
    id?: string;
    business_id?: string;
    company_name?: string;
    sub_account_id?: string;
    provider?: TerminalProviders;
    order_type?: TerminalOrderType;
    order_status?: TerminalOrderStatus;
    terminals?: OrderedTerminal[];
    created_at?: string;
    updated_at?: string;
}
declare class TerminalOrder {
    id?: string;
    business_id?: string;
    company_name?: string;
    sub_account_id?: string;
    provider: TerminalProviders;
    order_type?: TerminalOrderType;
    order_status?: TerminalOrderStatus;
    terminals?: OrderedTerminal[];
    order_items: TerminalOrderItem[];
    created_at?: string;
    updated_at?: string;
    constructor(data: ITerminalOrder);
    get payload(): {
        business_id: string | undefined;
        sub_account_id: string | undefined;
        order_type: TerminalOrderType | undefined;
        order_items: TerminalOrderItem[];
    };
    get totalQuantity(): number;
    updateTerminal(model_name: TerminalModelName, quantity: number): void;
}

interface ISavedPaymentMethod {
    payment_method_group_id?: string;
}
interface IPaymentMethodCard {
    address_postal_code: number;
    number: string;
    month: string;
    year: string;
    verification: string;
}
interface IPaymentMethodBankAccount {
    account_number: string;
    routing_number: string;
    account_type: string;
    account_holder_name: string;
    account_holder_type: string;
    country: string;
    currency: string;
}
type ISubmitCheckoutArgs = IPaymentMethodCard | IPaymentMethodBankAccount;
type IPaymentMethodMetadata = ISavedPaymentMethod & ISubmitCheckoutArgs;

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
interface IPaymentMethodData {
    card?: PaymentCard;
    bank_account?: PaymentBankAccount;
}
declare class PaymentMethodData implements IPaymentMethodData {
    card?: PaymentCard;
    bank_account?: PaymentBankAccount;
    constructor(paymentMethod: IPaymentMethodData);
    get payersName(): string | null;
    get lastFourDigits(): string | null;
}
type CardBrand = 'american_express' | 'diners_club' | 'discover' | 'jcb' | 'mastercard' | 'china_unionpay' | 'visa' | 'unknown';
interface IPaymentBankAccount {
    id: string;
    acct_last_four: string;
    name: string;
    brand: string;
    token: string;
    created_at: string;
    updated_at: string;
}
declare class PaymentBankAccount implements IPaymentBankAccount {
    id: string;
    acct_last_four: string;
    name: string;
    brand: string;
    token: string;
    created_at: string;
    updated_at: string;
    constructor(bankAccount: IPaymentBankAccount);
}
interface IPaymentCard {
    id: string;
    acct_last_four: string;
    name: string;
    brand: CardBrand;
    token: string;
    created_at: string;
    updated_at: string;
}
declare class PaymentCard implements IPaymentCard {
    id: string;
    acct_last_four: string;
    name: string;
    brand: CardBrand;
    token: string;
    created_at: string;
    updated_at: string;
    constructor(card: IPaymentCard);
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
    payment_method: IPaymentMethodData;
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
declare class Payment implements IPayment {
    id: string;
    account_id: string;
    amount: number;
    amount_disputed: number;
    amount_refundable: number;
    amount_refunded: number;
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
    payment_method: PaymentMethodData;
    payment_intent_id: string | null;
    refunded: boolean;
    status: PaymentStatuses;
    created_at: string;
    updated_at: string;
    statement_descriptor?: string;
    financial_transaction_id: string;
    returned: boolean;
    application_fee: IApplicationFee;
    refunds: IRefund[];
    transaction_hold: null;
    constructor(payment: IPayment);
    get disputedStatus(): DisputeStatus | null;
    get payment_type(): PaymentTypes;
    get payers_name(): string | null;
    get last_four_digits(): string | null;
}
interface PaymentsQueryParams {
    payment_id?: string;
    terminal_id?: string;
    payment_status?: PaymentStatuses;
    created_after?: string;
    created_before?: string;
}

declare enum PAYMENT_METHOD_TYPES {
    CARD = "card",
    BANK_ACCOUNT = "bank_account",
    APPLE_PAY = "apple_pay",
    GOOGLE_PAY = "google_pay",
    SEZZLE = "sezzle",
    PLAID = "plaid"
}
interface IBnpl {
    provider: string;
    provider_client_id: string;
    provider_mode: string;
    provider_checkout_url: string;
    provider_order_id: string;
    provider_api_version: string;
}
interface ICompletion {
    payment_mode?: ICheckoutPaymentMode;
    payment_token?: string | null;
    payment_status?: string | null;
    payment_response?: unknown;
    payment_error_code?: string | null;
    payment_error_description?: string | null;
    checkout_id?: string;
    additional_transactions?: unknown[];
    payment_id?: string;
    payment_method_id?: string;
    status?: string;
    created_at: string;
    updated_at: string;
}
declare class Completion implements ICompletion {
    payment_mode?: ICheckoutPaymentMode;
    payment_token?: string | null;
    payment_status?: string | null;
    payment_response?: unknown;
    payment_error_code?: string | null;
    payment_error_description?: string | null;
    checkout_id?: string;
    additional_transactions?: unknown[];
    payment_id?: string;
    payment_method_id?: string;
    status?: string;
    created_at: string;
    updated_at: string;
    constructor(data: ICompletion);
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
    application_fees?: unknown[] | null;
    successful_payment_id?: string | null;
    created_at: string;
    updated_at: string;
    completions?: ICompletion[];
}
declare class Checkout implements ICheckout {
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
    application_fees?: unknown[] | null;
    successful_payment_id?: string | null;
    created_at: string;
    updated_at: string;
    completions?: ICompletion[];
    sub_account_name?: string;
    constructor(data: ICheckout);
    get payment_mode(): ICheckoutPaymentMode;
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
type ICheckoutCompleteResponse = IApiResponse<{
    payment_mode: ICheckoutPaymentMode;
    payment_token: null;
    payment_status: string;
    payment_response: null;
    checkout_id: string;
    additional_transactions: unknown[];
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
type CheckoutCardBrand = 'visa' | 'mastercard' | 'american_express' | 'discover' | 'jcb' | 'diners_club' | 'unionpay';
type CheckoutAccountType = 'checking' | 'savings';
interface ICheckoutPaymentMethod {
    id: string;
    type: PAYMENT_METHOD_TYPES;
    status: string;
    invalid_reason: null;
    name: string;
    brand: CheckoutCardBrand;
    acct_last_four: string;
    account_type: CheckoutAccountType;
    month: string;
    year: string;
    address_line1_check: string;
    address_postal_code_check: string;
    bin_details: null;
}

interface PayoutsQueryParams {
    created_after?: string;
    created_before?: string;
}
declare enum PayoutStatuses {
    paid = "paid",
    failed = "failed",
    forwarded = "forwarded",
    scheduled = "scheduled",
    in_transit = "in_transit",
    canceled = "canceled"
}
declare enum PayoutStatusesSafeNames {
    paid = "Paid",
    failed = "Failed",
    forwarded = "Forwarded",
    scheduled = "Scheduled",
    in_transit = "In Transit",
    canceled = "Canceled"
}
interface IPayout {
    id: string;
    account_id: string;
    amount: number;
    bank_account: IBankAccount;
    currency: CurrencyTypes;
    delivery_method: string;
    description: string;
    deposits_at: string;
    fees_total: number;
    refunds_count: number;
    refunds_total: number;
    payments_count: number;
    payments_total: number;
    payout_type: 'ach' | 'cc';
    other_total: number;
    status: PayoutStatuses;
    metadata: object | null;
    created_at: string;
    updated_at: string;
    settlement_priority?: 'standard' | 'expedited';
}
declare class Payout implements IPayout {
    id: string;
    account_id: string;
    amount: number;
    bank_account: IBankAccount;
    currency: CurrencyTypes;
    delivery_method: string;
    description: string;
    deposits_at: string;
    fees_total: number;
    refunds_count: number;
    refunds_total: number;
    payments_count: number;
    payments_total: number;
    payout_type: 'ach' | 'cc';
    other_total: number;
    status: PayoutStatuses;
    metadata: object | null;
    created_at: string;
    updated_at: string;
    sub_account_name?: string;
    settlement_priority: 'standard' | 'expedited';
    constructor(payout: IPayout);
}

declare enum PaymentBalanceTxnType {
    payment = "payment",
    paymentFee = "payment_fee",
    payout = "payout",
    refund = "refund",
    feeRefund = "fee_refund",
    dispute = "dispute",
    disputeFee = "dispute_fee",
    disputeFeeRefund = "dispute_fee_refund",
    disputeRefund = "dispute_refund",
    applicationFeeReturned = "application_fee_returned"
}
interface IPaymentBalanceTransaction {
    id: string;
    amount: number;
    balance: number;
    currency: CurrencyTypes;
    financial_transaction_id: string;
    payment_id: string;
    payment_balance_txn_type: PaymentBalanceTxnType;
    source_id: string;
    source_type: string;
    created_at: string;
    updated_at: string;
}
declare class PaymentBalanceTransaction implements IPaymentBalanceTransaction {
    id: string;
    amount: number;
    balance: number;
    currency: CurrencyTypes;
    financial_transaction_id: string;
    payment_id: string;
    payment_balance_txn_type: PaymentBalanceTxnType;
    source_id: string;
    source_type: string;
    created_at: string;
    updated_at: string;
    constructor(balanceTransaction: IPaymentBalanceTransaction);
    get displayTransactionId(): string;
}

declare enum PayoutBalanceTransactionType {
    fee = "fee",
    payment = "payment",
    payout = "payout",
    sellerPaymentRefund = "seller_payment_refund",
    disputeAmountCollected = "dispute_amount_collected",
    disputeFeeCollected = "dispute_fee_collected",
    sellerPayment = "seller_payment",
    transfer = "transfer",
    partnerPlatformProceedsCredit = "partner_platform_proceeds_credit"
}
interface IPayoutBalanceTransaction {
    id: string;
    account_id: string;
    payout_id: string;
    financial_transaction_id: string;
    amount: number;
    fee: number;
    net: number;
    currency: CurrencyTypes;
    description: string;
    source_id: string;
    txn_type: PayoutBalanceTransactionType;
    created_at: string;
    available_on: string;
    updated_at: string;
}
declare class PayoutBalanceTransaction implements IPayoutBalanceTransaction {
    id: string;
    account_id: string;
    payout_id: string;
    financial_transaction_id: string;
    amount: number;
    fee: number;
    net: number;
    currency: CurrencyTypes;
    description: string;
    source_id: string;
    txn_type: PayoutBalanceTransactionType;
    created_at: string;
    available_on: string;
    updated_at: string;
    constructor(balanceTransaction: IPayoutBalanceTransaction);
}

export { AccountStatus, AccountType, CaptureStrategy, type CardBrand, Checkout, type CheckoutAccountType, type CheckoutCardBrand, type CheckoutsQueryParams, Completion, CompletionStatuses, CurrencyTypes, Dispute, DisputeResponse, DisputeStatus, type IApplicationFee, IBankAccount, type IBnpl, type ICheckout, type ICheckoutCompleteResponse, type ICheckoutPaymentMethod, ICheckoutPaymentMode, ICheckoutPaymentModeParam, type ICheckoutPaymentSettings, ICheckoutStatus, type ICompletion, type IDispute, type IDisputeResponse, type ILoadedEventResponse, type IPayment, type IPaymentBalanceTransaction, type IPaymentBankAccount, type IPaymentCard, type IPaymentDispute, type IPaymentMethodBankAccount, type IPaymentMethodCard, type IPaymentMethodData, type IPaymentMethodMetadata, type IPayout, type IPayoutBalanceTransaction, type IRefund, type IRefundPayload, type ISavedPaymentMethod, type ISubAccount, type ISubmitCheckoutArgs, type ITerminal, type ITerminalModel, type ITerminalModelApiResponse, type ITerminalModelsApiResponse, type ITerminalOrder, ITerminalStatus, type OrderedTerminal, PAYMENT_METHOD_TYPES, Payment, PaymentBalanceTransaction, PaymentBalanceTxnType, PaymentBankAccount, PaymentCard, PaymentMethodData, PaymentMethodTypes, PaymentStatuses, PaymentTypes, type PaymentsQueryParams, Payout, PayoutBalanceTransaction, PayoutBalanceTransactionType, PayoutStatuses, PayoutStatusesSafeNames, type PayoutsQueryParams, Refund, RefundPayload, RefundReasons, RefundStatuses, type RelatedAccounts, SubAccount, Terminal, TerminalModel, TerminalModelName, TerminalOrder, type TerminalOrderItem, type TerminalOrderQueryParams, TerminalOrderStatus, TerminalOrderType, TerminalProviders, type TerminalsQueryParams };
