// Re-export types from @justifi/types that don't have local overrides
export {
  // Utils
  CountryCode,
  StateOptions,
  getStateAbbreviation,
  filterNumber,
  constructDate,
  deconstructDate,
  normalizeCountry,

  // API types
  type IApiResponse,
  type IApiResponseCollection,
  type IErrorObject,
  type IServerError,
  // PagingInfo and ExtendedPagingInfo come from local Pagination.ts
  type IBillingInfo,
  type IBankAccountBillingInfo,
  type IPostalCode,
  type GrossVolumeReportDate,
  type GrossVolumeReport,
  type IQuote,

  // Business types - interfaces and enums only (classes have local versions)
  type IAddress,
  type IDocument,
  type DocumentRecordData,
  EntityDocumentType,
  EntityDocumentStatus,
  type Identity,
  type IBusiness,
  BusinessClassification,
  type IAdditionalQuestions,
  type ProductCategories,
  type ICoreBusinessInfo,
  BusinessFormServerErrors,

  // Entity types - interfaces and enums only (classes have local versions)
  type IDispute,
  DisputeStatus,
  type ISubAccount,
  AccountType,
  AccountStatus,
  type ITerminalModel,
  TerminalModelName,
  type ITerminal,
  TerminalProviders,
  ITerminalStatus,
  TerminalsQueryParams,
  type ITerminalOrder,
  TerminalOrderStatus,
  TerminalOrderType,
  TerminalOrderQueryParams,
  type OrderedTerminal,
  type TerminalOrderItem,
  type ISavedPaymentMethod,
  type IPaymentMethodCard,
  type IPaymentMethodBankAccount,

  // Checkout types for compatibility
  CheckoutCardBrand,
  CheckoutAccountType,
} from '@justifi/types';

// Alias exports for backward compatibility
export { CheckoutCardBrand as CardBrand } from '@justifi/types';
export { CheckoutAccountType as BankAccountType } from '@justifi/types';

// Component-specific exports (these stay in webcomponents)
export { Api } from './Api';
export * from './ComponentEvents';
export * from './ComponentError';
export * from './ApplePay';
export * from './Pagination';
export * from './DisputeEvidenceDocument';
export * from './Business';
export * from './Identity';
export * from './Dispute';
export * from './GrossVolume';
export * from './Plaid';

// Entity classes with helper methods (formattedPaymentAmount) - local versions
export * from './Payment';
export * from './Payout';
export * from './Checkout';
export * from './PaymentBalanceTransaction';
export * from './PayoutBalanceTransaction';
export * from './Refund';
export * from './BankAccount';
export * from './SubAccount';
export * from './Terminal';
export * from './TerminalModel';
export * from './TerminalOrder';

// Document exports - EntityDocument classes stay here (use browser APIs)
export {
  EntityDocumentStorage,
  EntityDocument,
  type FileSelectEvent,
  type EntityFileData,
} from './Document';
