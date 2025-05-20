import { createStore } from '@stencil/store';

const { state, onChange } = createStore({
  authToken: '',
  accountId: '',
  paymentMethods: [],
  paymentMethodGroupId: '',
  paymentDescription: '',
  totalAmount: 0,
  selectedPaymentMethod: '',
  checkoutId: '',
});

onChange('authToken', (newValue) => {
  state.authToken = newValue;
});

onChange('accountId', (newValue) => {
  state.accountId = newValue;
});

onChange('paymentDescription', (newValue) => {
  state.paymentDescription = newValue;
});

onChange('totalAmount', (newValue) => {
  state.totalAmount = newValue;
});

onChange('paymentMethods', (newValue) => {
  state.paymentMethods = newValue;
});

onChange('paymentMethodGroupId', (newValue) => {
  state.paymentMethodGroupId = newValue;
});

onChange('selectedPaymentMethod', (newValue) => {
  state.selectedPaymentMethod = newValue;
});

onChange('checkoutId', (newValue) => {
  state.checkoutId = newValue;
});

export default state;
