// Basic
export const color = 'color';
export const fontFamily = 'font-family';
export const backgroundColor = 'background-color';

// Typography
export const text = `text ${color} ${fontFamily}`;
export const textPrimary = `text-primary ${text}`;
export const textSecondary = `text-secondary ${text}`;
export const textDanger = `text-danger ${text}`;
export const heading = `heading ${text}`;
export const paragraph = `paragraph ${text}`;
export const heading1 = `heading-1 ${heading}`;
export const heading2 = `heading-2 ${heading}`;
export const heading3 = `heading-3 ${heading}`;
export const heading4 = `heading-4 ${heading}`;
export const heading5 = `heading-5 ${heading}`;
export const link = `link ${text}`;

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

export const inputAdornment = `input-adornment ${text}`;

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
export const tableRow = `table-row ${text} ${backgroundColor}`;
export const tableHeaderRow = `table-header-row ${text} ${backgroundColor}`;
export const tableCell = `table-cell ${text} ${backgroundColor}`;
export const tableHeadCell = `table-head-cell ${tableCell}`;
export const tableFootCell = `table-foot-cell ${tableCell}`;
export const tableCellEven = `table-cell-even ${tableCell}`;
export const tableCellOdd = `table-cell-odd ${tableCell}`;
export const getAlternateTableCellPart = (index) =>
  index % 2 ? tableCellEven : tableCellOdd;
export const tableEmpty = `table-empty ${text} ${backgroundColor}`;
export const tableError = `table-error ${text} ${backgroundColor}`;

// Pagination
export const paginationItem = `pagination-item ${text} ${backgroundColor}`;
export const paginationItemText = `pagination-item-text ${text}`;
export const paginationItemIcon = `pagination-item-icon ${text}`;
export const paginationItemIconNext = `pagination-item-icon-next ${paginationItemIcon}`;
export const paginationItemIconPrevious = `pagination-item-icon-previous ${paginationItemIcon}`;

// Loading spinner
export const loadingSpinner = `loading-spinner`;

// Badge
export const badge = `badge ${fontFamily}`;
export const badgePrimary = `${badge} badge-primary`;
export const badgeSecondary = `${badge} badge-secondary`;
export const badgeSuccess = `${badge} badge-success`;
export const badgeDanger = `${badge} badge-danger`;
export const badgeWarning = `${badge} badge-warning`;
export const badgeInfo = `${badge} badge-info`;
export const badgeLight = `${badge} badge-light`;
export const badgeDark = `${badge} badge-dark`;

// Dropdown-menu
export const dropdownMenu = `dropdown-menu ${text}`;

// Radio List Item
export const radioListItem = `radio-list-item ${text}`;

// Bootstrap list-group
export const listGroup = `list-group ${text} ${backgroundColor}`;
export const listGroupItem = `list-group-item ${text} ${backgroundColor}`;

// Skeleton
export const skeleton = `skeleton`;

// Image
export const image = `image`;

// Component specific
// This allows specific sections of a component to be hidden, for example
// ::part(billing-form) { display: none; }
export const billingForm = `billing-form`;
export const checkoutSummary = `checkout-summary`;

// Filters
export const filterMenu = `filter-menu`;

// Payments List Filters
export const paymentsListFilterMenu = `${filterMenu} payments-list-filter-menu`;
export const paymentsListFilterParam = `payments-list-filter-param`;
export const paymentIdPaymentsListFilterParam = `${paymentsListFilterParam} payment-id-payments-list-filter-param`;
export const terminalIdPaymentsListFilterParam = `${paymentsListFilterParam} terminal-id-payments-list-filter-param`;
export const paymentStatusPaymentsListFilterParam = `${paymentsListFilterParam} payment-status-payments-list-filter-param`;
export const createdAfterPaymentsListFilterParam = `${paymentsListFilterParam} created-after-payments-list-filter-param`;
export const createdBeforePaymentsListFilterParam = `${paymentsListFilterParam} created-before-payments-list-filter-param`;

// Payouts List Filters

export const payoutsListFilterMenu = `${filterMenu} payouts-list-filter-menu`;
export const payoutsListFilterParam = `payouts-list-filter-param`;
export const createdAfterPayoutsListFilterParam = `${payoutsListFilterParam} created-after-payouts-list-filter-param`;
export const createdBeforePayoutsListFilterParam = `${payoutsListFilterParam} created-before-payouts-list-filter-param`;

// Checkouts List Filters
export const checkoutsListFilterMenu = `${filterMenu} checkouts-list-filter-menu`;
export const checkoutsListFilterParam = `checkouts-list-filter-param`;
export const statusCheckoutsListFilterParam = `${checkoutsListFilterParam} checkout-status-checkouts-list-filter-param`;
export const paymentModeCheckoutsListFilterParam = `${checkoutsListFilterParam} payment-mode-checkouts-list-filter-param`;

// Terminals List Filters
export const terminalsListFilterMenu = `${filterMenu} terminals-list-filter-menu`;
export const terminalsListFilterParam = `terminals-list-filter-param`;
export const terminalIdTerminalsListFilterParam = `${terminalsListFilterParam} terminal-id-terminals-list-filter-param`;
export const terminalOrderIdTerminalsListFilterParam = `${terminalsListFilterParam} terminal-order-id-terminals-list-filter-param`;
export const terminalStatusTerminalsListFilterParam = `${terminalsListFilterParam} terminal-status-terminals-list-filter-param`;

// Terminal Orders List Filters
export const terminalOrdersListFilterMenu = `${filterMenu} terminal-orders-list-filter-menu`;
export const terminalOrdersListFilterParam = `terminal-orders-list-filter-param`;
export const orderStatusTerminalOrdersListFilterParam = `${terminalOrdersListFilterParam} order-status-terminal-orders-list-filter-param`;
export const orderTypeTerminalOrdersListFilterParam = `${terminalOrdersListFilterParam} order-type-terminal-orders-list-filter-param`;
export const createdAfterTerminalOrdersListFilterParam = `${terminalOrdersListFilterParam} created-after-terminal-orders-list-filter-param`;
export const createdBeforeTerminalOrdersListFilterParam = `${terminalOrdersListFilterParam} created-before-terminal-orders-list-filter-param`;
