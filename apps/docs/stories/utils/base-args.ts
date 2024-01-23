type ArgNames = 'auth-token' | 'account-id';
type ArgValues = { [key in ArgNames]?: string; };
type ArgTypes = { [key in ArgNames]?: any; }

const args: ArgValues = {
  'account-id': 'acc_5Et9iXrSSAZR2KSouQGAWi',
  'auth-token': 'eyJraWQiOiJqdXN0aWZpLWUyNDgyMmU3ODE1MmEzZjRkMjU1IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguanVzdGlmaS5haS8iLCJhenAiOiJvYXNfMmlsWHBqOHQ2WVlEQ0xWU0FiVFczMiIsInN1YiI6Im9hc18yaWxYcGo4dDZZWURDTFZTQWJUVzMyQHNlc3Npb25zIiwiYXVkIjoiaHR0cHM6Ly9hcGkuanVzdGlmaS5haS92MSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsInBlcm1pc3Npb25zIjpbeyJyb2xlIjoicmVhZDphY2NvdW50IiwicmVzb3VyY2VfaWQiOiJhY2NfNUV0OWlYclNTQVpSMktTb3VRR0FXaSJ9LHsicm9sZSI6InJlYWQ6YnVzaW5lc3MiLCJyZXNvdXJjZV9pZCI6ImJpel8zYmg2OWJxMXJrM2RtWE5vQUtWb251In1dLCJleHAiOjE3MTE1NTk0MTQsImlhdCI6MTcwMzc4MzQxNCwicGxhdGZvcm1fYWNjb3VudF9pZCI6ImFjY18zcmVOYjRhTll5MmlXRFpRVmN6bXg0In0.oPOoDYxzrnpE8PRUaz-FCU4KqnSuNbFTeDkl3AtMscjUkIctP1OIFh-ZGBjbH5eVH5noXCbaiin0j92dS7jx4gLpxuYT2Q8gpZbuIsT7fa58elvGeRkUUJ-AC5ueZxlv90yPWMm0OIbyrV7XZhuwYyKbV-ZczEbl2JpvBMe40CM-LdClQV66d_-Kw9a23SabBVfYgP5V-5OsagOIESvzZoO-27tGlNkV2a-hxqddDCOZv0HvRYAtp5S7EQrmRdEBu5gCNbf1eRFG424hxZUFVr2LdetYuKQLxJjDdUjf86ZwEUecrEaDSupiN1VC3CitdOwBVf6-R_N0VpN4VLVD5g',
}

const argTypes: ArgTypes = {
  'auth-token': {
    type: 'string',
    description: 'Auth token `string`',
    control: {
      type: 'text',
    },
    table: {
      category: 'props'
    }
  },
  'account-id': {
    type: 'string',
    description: 'Account ID `string`',
    control: {
      type: 'text',
    },
    table: {
      category: 'props'
    }
  }
}

export class StoryBaseArgs {
  args: ArgValues = {};
  argTypes: ArgTypes = {};

  constructor(argKeys: ArgNames[]) {
    argKeys.forEach(key => {
      this.args[key] = args[key];
      this.argTypes[key] = argTypes[key];
    });
  }
}
