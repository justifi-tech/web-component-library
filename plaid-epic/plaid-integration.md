## Introduction

The integration with Plaid allows us to securely retrieve a customer's bank details, ensuring the data is both accurate and protected. The integration process consists of three phases:

1. **Link Token Generation**:  
   We generate a **Link Token**, which enables a web component where the customer can securely enter their bank details and log in via Plaid. This generates a temporary public access token.

2. **Access Token Exchange**:  
   Using the public access token, we can exchange it for a final, non-expiring Access Token. This token provides the necessary authorization to retrieve the customer’s bank details.

3. **Data Retrieval**:  
   With the final Access Token, we can securely retrieve the customer’s bank details, allowing us to utilize our APIs and create a payment method.

## Expiration

- **Link Token**: 24 hours
- **Public Access Token**: 30 minutes

## Authorization

To use the following two routes, the request must include a web component token with the authorized account tokenize permission

```json
{
  "resources": ["write:tokenize:acc_323sM3WDAUnHH0fJD7re9h"]
}
```

## Routes

### `/plaid/:account_id/link`

Returns a generated LinkToken that allows the front-end to integrate with Plaid’s web component

#### Parameters

- **account_id** (_request_): The public id of the SubAccount
- **checkout_id** (_body_) (_optional_): The public id of the Checkout, which can be saved in the LinkToken model

#### Response

**200 OK**

```json
{
  "id": "plt_535LSYhZPBEjStqDYDzPky",
  "type": "link_token",
  "page_info": null,
  "data": {
    "id": "plt_535LSYhZPBEjStqDYDzPky",
    "expiration": "2025-01-23T02:13:27.000Z",
    "link_token": "link-sandbox-b3b494d9-16ca-4a80-a3ac-d4a1955f3672",
    "request_id": "a4gw0TqGpCXeRfY"
  }
}
```

- **id** (_string_): The `Plaid::LinkToken` public id
- **type** (_string_): The model type, aways link_token on this request
- **expiration** (_datetime_): Date and time of link token expiration
- **link_token** (_string_): The link token index, used to integrate with Plaid's front-end library
- **request_id** (_string_): Id of the request made to Plaid, for logging purposes

### `/plaid/:account_id/tokenize`

Trade the public token for an access token, get the bank information, and create a payment method

#### Parameters

- **account_id** (_request_): The public id of the SubAccount
- **public_token** (_body_): The public token returned from Plaid's front-end integration
- **link_token_id** (_body_): The link token public id
- **payment_method_group_id** (_body_) (_optional_): The payment method group the payment method will belong to

#### Response

Returns the serialized `PaymentMethod`

**201 Created**

```json
{
  "id": "pm_TMV0qZZEcYWZDZXOdbBDv",
  "type": "payment_method",
  "data": {
    "signature": "7aese8adDxEUeaHi4XerO5",
    "customer_id": "cust_3KJrvKmAGHq027AJn43WVa",
    "account_id": "acc_323sM3WDAUnHH0fJD7re9h",
    "status": "valid",
    "invalid_reason": null,
    "bank_account": {
      "id": "pm_TMV0qZZEcYWZDZXOdbBDv",
      "account_owner_name": "Plaid Gold Standard 0% Interest Checking",
      "account_type": "checking",
      "bank_name": null,
      "acct_last_four": "0000",
      "token": "pm_TMV0qZZEcYWZDZXOdbBDv",
      "metadata": null
    }
  },
  "page_info": null
}
```

## Error codes

- **404 Not Found**: The specified Account, Checkout, or Plaid::LinkToken in the parameters does not exist
- **502 Bad Gateway**: Plaid integration error (invalid public_token or service outage)
