import { createStore } from '@stencil/store';

const { state, onChange } = createStore({
  authToken: '',
  accountId: '',
});

onChange('authToken', (newValue) => {
  state.authToken = newValue;
  console.log('Auth token changed:', newValue);
});

onChange('accountId', (newValue) => {
  state.accountId = newValue;
  console.log('Account ID changed:', newValue);
});

export default state;
