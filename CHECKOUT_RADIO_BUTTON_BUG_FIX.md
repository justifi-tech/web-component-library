# Checkout Component Radio Button Bug Fix

## Bug Description
When the checkout component is rendered with only one payment method option (e.g., when `disable-bank-account`, `disable-bnpl`, and `disable-payment-method-group` are all set to true), it still displays the radio button along with that option.

## Expected Behavior
When there's only one payment method option available, the radio button should be hidden and only the form should be displayed directly (without the radio button and label).

## Root Cause
The issue was in the `hiddenRadioInput` getter in `new-payment-method.tsx`:

```tsx
private get hiddenRadioInput() {
  return !this.showAch || !this.showCard;
}
```

This logic hides the radio button whenever EITHER ACH OR card is disabled, but it should only hide the radio button when there's exactly ONE payment method option available in total.

## Solution
I implemented a comprehensive fix that:

1. **Added a new prop** `totalPaymentMethodOptions` to all payment method components
2. **Modified the parent component** to calculate and pass the total number of available payment methods
3. **Updated the logic** to only hide radio buttons when there's exactly one option

## Files Modified

### 1. `/packages/webcomponents/src/components/checkout/payment-method-options.tsx`
- Added `total-payment-method-options={this.paymentMethodOptions.length}` prop to all child payment method components
- This ensures each component knows the total number of available options

### 2. `/packages/webcomponents/src/components/checkout/new-payment-method.tsx`
- Added `@Prop() totalPaymentMethodOptions?: number;`
- Updated `hiddenRadioInput` getter:
  ```tsx
  private get hiddenRadioInput() {
    // Only hide the radio button if there's exactly one payment method option available
    return this.totalPaymentMethodOptions === 1;
  }
  ```

### 3. `/packages/webcomponents/src/components/checkout/saved-payment-method.tsx`
- Added `@Prop() totalPaymentMethodOptions?: number;`
- Added `hiddenRadioInput` getter with same logic
- Added `hidden={this.hiddenRadioInput}` to the radio button container

### 4. `/packages/webcomponents/src/components/checkout/sezzle-payment-method.tsx`
- Added `@Prop() totalPaymentMethodOptions?: number;`
- Added `hiddenRadioInput` getter with same logic
- Added `hidden={this.hiddenRadioInput}` to the radio button container

## How to Test the Fix

1. Go to the checkout component in Storybook
2. Set these props to true:
   - `disable-bank-account`
   - `disable-bnpl`
   - `disable-payment-method-group`
3. Verify that only the credit card form is displayed without the radio button
4. Similarly, test with only bank account enabled by setting:
   - `disable-credit-card`
   - `disable-bnpl`
   - `disable-payment-method-group`

## Benefits of This Approach

1. **Consistent behavior**: All payment method components now follow the same logic
2. **Accurate detection**: Uses the actual count of available options rather than individual flags
3. **Maintainable**: Adding new payment methods won't require updating the hide logic
4. **Clean UI**: When there's only one option, users get a cleaner interface without unnecessary radio buttons

## Backward Compatibility
This change is fully backward compatible. The new `totalPaymentMethodOptions` prop is optional and defaults to showing radio buttons (existing behavior) when not provided.