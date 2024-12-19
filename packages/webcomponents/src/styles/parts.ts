// Basic
export const color = 'color';
export const fontFamily = 'font-family';
export const backgroundColor = 'background-color';

// Typography
export const text = `text ${color} ${fontFamily}`;
export const textDanger = `text-danger ${fontFamily}`;
export const heading = `heading ${text}`;
export const paragraph = `paragraph ${text}`;
export const heading1 = `heading-1 ${heading}`;
export const heading2 = `heading-2 ${heading}`;
export const heading3 = `heading-3 ${heading}`;

// Button
export const button = `button ${text}`;
export const buttonPrimary = `button-primary ${button}`;
export const buttonSecondary = `button-secondary ${button}`;
export const buttonDanger = `button-danger ${button}`;
export const buttonLink = `button-link ${button}`;
export const buttonLoading = `button-loading`;
export const buttonDisabled = `button-disabled ${button}`;

// Input
export const label = `label ${text}`;
export const input = `input ${text} ${backgroundColor}`;
export const inputGroup = `input-group ${input}`;
export const inputInvalid = `input-invalid ${input}`;
export const inputDisabled = `input-disabled ${input}`;
export const inputFocused = `input-focused ${input}`;
export const inputInvalidAndFocused = `input-invalid-and-focused ${input}`;

export const inputRadio = `input-radio`;
export const inputRadioFocused = `input-radio-focused ${inputRadio}`;
export const inputRadioChecked = `input-radio-checked ${inputRadio}`;
export const inputRadioCheckedFocused = `input-radio-checked-focused ${inputRadio}`;
export const inputRadioInvalid = `input-radio-invalid ${inputRadio}`;

export const inputCheckbox = `input-checkbox`;
export const inputCheckboxInvalid = `input-checkbox-invalid ${inputCheckbox}`;
export const inputCheckboxFocused = `input-checkbox-focused ${inputCheckbox}`;
export const inputCheckboxChecked = `input-checkbox-checked ${inputCheckbox}`;
export const inputCheckboxCheckedFocused = `input-checkbox-checked-focused ${inputCheckbox}`;

// Alert
export const alert = `alert ${text}`;
export const alertDanger = `alert-danger ${alert}`;

// Tooltip
export const tooltip = `tooltip ${text}`;
export const tooltipIcon = `tooltip-icon ${text}`;
export const tooltipInner = `tooltip-inner ${text}`;

// Card
export const card = `card ${text} ${backgroundColor}`;

// Table
export const table = `table ${text} ${backgroundColor}`;
export const tableCell = `table-cell ${text} ${backgroundColor}`;
export const tableHeadCell = `table-head-cell ${tableCell} ${text} ${backgroundColor}`;
export const tableCellEven = `table-cell-even ${tableCell} ${text} ${backgroundColor}`;
export const tableCellOdd = `table-cell-odd ${tableCell} ${text} ${backgroundColor}`;
export const getAlternateTableCellPart = (index) =>
  index % 2 ? tableCellEven : tableCellOdd;
export const tableEmpty = `table-empty ${text}`;
export const tableError = `table-error ${text}`;

// Loading spinner
export const loadingSpinner = `loading-spinner`;

// Badge
export const badge = `badge ${text}`;

// Dropdown-menu
export const dropdownMenu = `dropdown-menu ${text}`;

// Radio List Item
export const radioListItem = `radio-list-item ${text}`;

// Skeleton
export const skeleton = `skeleton ${backgroundColor}`;

// Component specific
// This allows the billing form to be hidden, for exemple
// ::part(billing-form) { display: none; }
export const billingForm = `billing-form`;
