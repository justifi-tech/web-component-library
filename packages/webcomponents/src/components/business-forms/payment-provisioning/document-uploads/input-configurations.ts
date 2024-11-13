import { EntityDocumentType } from "../../../../api/EntityDocument";

const voidedCheck = {
  name: "voided_check",
  label: "Upload Voided Check",
  documentType: EntityDocumentType.voidedCheck,
  helpText: "Voided check or bank statement where the legal entity and account number are clearly visible. The check must match the legal entity registering for this merchant account."
};

const bankStatements = {
  name: "bank_statement",
  label: "Upload Bank Statements",
  documentType: EntityDocumentType.bankStatement,
  helpText: "The most recent 3 months of your business’ bank statements. The statements must match the legal entity registering for this merchant account."
};

const balanceSheet = {
  name: "balance_sheet",
  label: "Upload FYE Balance Sheets",
  documentType: EntityDocumentType.balanceSheet,
  helpText: "Please provide the balance sheet that corresponds to the last day of your business' last two fiscal years. For example, 12/31/2022 & 12/31/2023 balance sheets."
};

const governmentId = {
  name: 'government_id',
  label: 'Upload Government ID (optional)',
  documentType: EntityDocumentType.governmentId,
  helpText: "The ID must include a personal address."
};

const profitAndLossStatement = {
  name: "profit_and_loss_statement",
  label: "Upload FYE Profit and Loss Statements",
  documentType: EntityDocumentType.profitAndLossStatement,
  helpText: "Fiscal Year End Profit and Loss statements for your business’ last two fiscal years. For example, FYE 2022 and FYE 2023 profit and loss statements."
};

const ss4 = {
  name: 'ss4',
  label: 'Upload SS4 / Article of Incorporation (optional)',
  documentType: EntityDocumentType.taxReturn,
  helpText: "Please upload the business's SS4 / Article of Incorporation."
};

const other = {
  name: 'other',
  label: 'Upload any other documents (optional)',
  documentType: EntityDocumentType.other,
  helpText: "Please upload any other documents that may be relevant to your business."
};

export const inputConfigurations = {
  voidedCheck,
  bankStatements,
  balanceSheet,
  governmentId,
  profitAndLossStatement,
  ss4,
  other
};
