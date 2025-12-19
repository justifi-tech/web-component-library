interface IBankAccount {
    id?: string;
    account_owner_name?: string;
    full_name?: string;
    account_type?: string;
    account_number?: string;
    acct_last_four?: string;
    account_number_last4?: string;
    routing_number?: string;
    institution_number?: string;
    transit_number?: string;
    bank_name?: string;
    country?: string;
    currency?: string;
    nickname?: string;
    metadata?: unknown;
    business_id?: string;
    platform_account_id?: string;
    created_at?: string;
    updated_at?: string;
}
declare class BankAccount implements IBankAccount {
    id?: string;
    account_owner_name?: string;
    full_name?: string;
    account_type?: string;
    account_number?: string;
    acct_last_four?: string;
    account_number_last4?: string;
    routing_number?: string;
    institution_number?: string;
    transit_number?: string;
    bank_name?: string;
    country?: string;
    currency?: string;
    nickname?: string;
    metadata?: unknown;
    business_id?: string;
    platform_account_id?: string;
    created_at?: string;
    updated_at?: string;
    constructor(data: IBankAccount);
    get payload(): {
        account_owner_name: string;
        account_type: string;
        account_number: string;
        routing_number: string;
        institution_number: string;
        transit_number: string;
        bank_name: string;
        nickname: string;
        business_id: string;
    };
}

export { BankAccount as B, type IBankAccount as I };
