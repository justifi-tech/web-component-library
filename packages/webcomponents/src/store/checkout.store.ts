import { createStore } from '@stencil/store';

const { state, onChange } = createStore({
  authToken: '',
  accountId: '',
});

onChange('authToken', (newValue) => {
  state.authToken = newValue;
});

onChange('accountId', (newValue) => {
  state.accountId = newValue;
});

export default state;
