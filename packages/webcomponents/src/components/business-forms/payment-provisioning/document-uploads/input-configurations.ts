import { EntityDocumentType } from "../../../../api/Document";

const voidedCheck = {
  name: 'voided_check',
  label: 'Upload Voided Check',
  documentType: EntityDocumentType.voidedCheck,
  helpText: 'Please upload a voided check for the business.'
};

const bankStatements = {
  name: 'bank_statement',
  label: 'Upload Bank Statements',
  documentType: EntityDocumentType.bankStatement,
  helpText: 'Please upload 3 months of bank statements for the business.'
};

const balanceSheet = {
  name: 'balance_sheet',
  label: 'Upload FYE Balance Sheet',
  documentType: EntityDocumentType.balanceSheet,
  helpText: 'Please upload the most recent 2 years of balance sheets.'
};

const governmentId = {
  name: 'government_id',
  label: 'Upload Government ID',
  documentType: EntityDocumentType.governmentId,
  helpText: 'Please upload a government issued ID for the business owner.'
};

const profitAndLossStatement = {
  name: 'profit_and_loss_statement',
  label: 'Upload Profit and Loss Statements',
  documentType: EntityDocumentType.profitAndLossStatement,
  helpText: 'Please upload the most recent profit and loss statements.'
};

const ss4 = {
  name: 'ss4',
  label: 'Upload SS4 / Article of Incorporation',
  documentType: EntityDocumentType.other,
  helpText: "Please upload the business's SS4 / Article of Incorporation."
};

const other = {
  name: 'other',
  label: 'Upload any other documents',
  documentType: EntityDocumentType.other,
  helpText: 'Please upload any other documents that may be relevant to your business.'
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
