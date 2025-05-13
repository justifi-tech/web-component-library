import { createStore } from '@stencil/store';

const { state, onChange } = createStore({
  authToken: '',
  accountId: '',
  paymentMethods: [],
  paymentMethodGroupId: '',
  paymentDescription: '',
  totalAmount: 0,
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

export default state;
