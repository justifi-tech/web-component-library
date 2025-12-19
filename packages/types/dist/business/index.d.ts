import { C as CountryCode } from '../country-codes-JIQ9gy-p.js';
import { I as IBankAccount } from '../BankAccount-CefqeO4K.js';

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
declare class Address implements IAddress {
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
    constructor(address: IAddress);
    get payload(): {
        platform_account_id: string;
        line1: string;
        line2: string;
        postal_code: string;
        city: string;
        state: string;
        country: string;
    };
}

interface IDocument {
    business_id: string;
    created_at: string;
    description: string | null;
    document_type: string;
    file_name: string;
    file_type: string;
    id: string;
    identity_id: string;
    metadata: unknown;
    platform_account_id: string;
    presigned_url: string | null;
    status: EntityDocumentStatus;
    updated_at: string;
}
declare enum EntityDocumentType {
    voidedCheck = "voided_check",
    balanceSheet = "balance_sheet",
    bankStatement = "bank_statement",
    governmentId = "government_id",
    profitAndLossStatement = "profit_and_loss_statement",
    taxReturn = "tax_return",
    other = "other"
}
declare enum EntityDocumentStatus {
    pending = "pending",
    uploaded = "uploaded",
    canceled = "canceled",
    needed = "needed"
}
interface DocumentRecordData {
    business_id: string;
    document_type: EntityDocumentType;
    file_name: string;
    file_type: string;
}

interface Identity {
    address?: IAddress;
    created_at?: string;
    dob_day?: string;
    dob_month?: string;
    dob_year?: string;
    documents?: IDocument[];
    email?: string;
    id?: string;
    business_id?: string;
    is_owner?: boolean;
    metadata?: unknown;
    name?: string;
    phone?: string;
    platform_account_id?: string;
    identification_number?: string;
    ssn_last4?: string;
    title?: string;
    updated_at?: string;
}
declare class Owner implements Identity {
    address?: Address;
    created_at?: string;
    dob_day?: string;
    dob_month?: string;
    dob_year?: string;
    dob_full?: string;
    documents?: IDocument[];
    email?: string;
    id?: string;
    business_id?: string;
    is_owner?: boolean;
    metadata?: unknown;
    name?: string;
    phone?: string;
    platform_account_id?: string;
    identification_number?: string;
    ssn_last4?: string;
    title?: string;
    updated_at?: string;
    constructor(owner: Identity);
    get payload(): {
        address: {
            platform_account_id: string;
            line1: string;
            line2: string;
            postal_code: string;
            city: string;
            state: string;
            country: string;
        };
        dob_day: string;
        dob_month: string;
        dob_year: string;
        email: string;
        identification_number: string | undefined;
        is_owner: boolean;
        metadata: {} | null;
        name: string;
        phone: string;
        platform_account_id: string | null;
        title: string;
    };
}
declare class Representative implements Identity {
    address?: Address;
    created_at?: string;
    dob_day?: string;
    dob_month?: string;
    dob_year?: string;
    dob_full?: string;
    documents?: IDocument[];
    email?: string;
    id?: string;
    business_id?: string;
    is_owner?: boolean;
    metadata?: unknown;
    name?: string;
    phone?: string;
    platform_account_id?: string;
    identification_number?: string;
    ssn_last4?: string;
    title?: string;
    updated_at?: string;
    constructor(representative: Identity);
    get payload(): {
        address: {
            platform_account_id: string;
            line1: string;
            line2: string;
            postal_code: string;
            city: string;
            state: string;
            country: string;
        };
        dob_day: string;
        dob_month: string;
        dob_year: string;
        email: string;
        is_owner: boolean;
        identification_number: string | undefined;
        metadata: {} | null;
        name: string;
        phone: string;
        platform_account_id: string | null;
        title: string;
    };
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
    payload?: unknown;
}
declare class AdditionalQuestions implements IAdditionalQuestions {
    business_revenue?: string;
    business_payment_volume?: string;
    business_when_service_received?: string;
    business_recurring_payments?: string;
    business_recurring_payments_percentage?: string;
    business_seasonal?: string;
    business_other_payment_details?: string;
    constructor(additionalQuestions: IAdditionalQuestions);
    get payload(): {
        business_revenue: string;
        business_payment_volume: string;
        business_when_service_received: string;
        business_recurring_payments: string;
        business_recurring_payments_percentage: string;
        business_seasonal: string;
        business_other_payment_details: string;
    };
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
declare class CoreBusinessInfo implements ICoreBusinessInfo {
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
    constructor(coreBusinessInfo: ICoreBusinessInfo);
    get payload(): {
        classification: string;
        legal_name: string;
        doing_business_as: string;
        industry: string;
        tax_id: string;
        website_url: string;
        email: string;
        phone: string;
        date_of_incorporation: string;
    };
}
interface IBusiness {
    additional_questions: IAdditionalQuestions;
    associated_accounts: unknown[];
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
    metadata: unknown;
    owners: Identity[];
    phone: string;
    platform_account_id: string;
    product_categories: ProductCategories;
    representative?: Identity | null;
    tax_id: string;
    tax_id_last4: string;
    terms_conditions_accepted: boolean;
    updated_at: string;
    website_url: string;
    date_of_incorporation?: string;
    country_of_establishment?: CountryCode;
}
declare class Business implements IBusiness {
    additional_questions: IAdditionalQuestions;
    associated_accounts: unknown[];
    classification: BusinessClassification;
    bank_accounts: IBankAccount[];
    created_at: string;
    documents: IDocument[];
    doing_business_as: string;
    email: string;
    id: string;
    industry: string;
    legal_address?: Address | null;
    legal_name: string;
    metadata: unknown;
    owners: Identity[];
    phone: string;
    platform_account_id: string;
    representative?: Identity | null;
    tax_id: string;
    tax_id_last4: string;
    terms_conditions_accepted: boolean;
    updated_at: string;
    website_url: string;
    date_of_incorporation?: string;
    product_categories: ProductCategories;
    country_of_establishment?: CountryCode;
    constructor(business: IBusiness);
    get payload(): {
        additional_questions: {
            business_revenue: string;
            business_payment_volume: string;
            business_when_service_received: string;
            business_recurring_payments: string;
            business_recurring_payments_percentage: string;
            business_seasonal: string;
            business_other_payment_details: string;
        };
        classification: BusinessClassification;
        doing_business_as: string;
        email: string;
        industry: string;
        legal_address: {
            platform_account_id: string;
            line1: string;
            line2: string;
            postal_code: string;
            city: string;
            state: string;
            country: string;
        };
        legal_name: string;
        metadata: {};
        owners: {
            id: string | undefined;
        }[];
        phone: string;
        platform_account_id: string;
        representative: {
            address: {
                platform_account_id: string;
                line1: string;
                line2: string;
                postal_code: string;
                city: string;
                state: string;
                country: string;
            };
            dob_day: string;
            dob_month: string;
            dob_year: string;
            email: string;
            is_owner: boolean;
            identification_number: string | undefined;
            metadata: {} | null;
            name: string;
            phone: string;
            platform_account_id: string | null;
            title: string;
        };
        tax_id: string;
        tax_id_last4: string;
        website_url: string;
        date_of_incorporation: string;
        country_of_establishment: CountryCode;
    };
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

export { AdditionalQuestions, Address, Business, BusinessClassification, BusinessFormServerErrors, CoreBusinessInfo, type DocumentRecordData, EntityDocumentStatus, EntityDocumentType, type IAdditionalQuestions, type IAddress, type IBusiness, type ICoreBusinessInfo, type IDocument, type IProductReadiness, type Identity, Owner, type ProductCategories, Representative };
