# Test Plaid integration

# Sample App

Repository: [https://github.com/plaid/tutorial-resources](https://github.com/plaid/tutorial-resources/tree/main/auth/start)

Sample application: .[/auth/start](https://github.com/plaid/tutorial-resources/tree/main/auth/start)

### 1\. Install dependencies:

$ pnpm install

### 2\. Create a link token

[Call API 1](#1.-create-a-link-token:)

### 3\. Use the link token with Plaid.create() function

Update file: auth/start/public/js/[connect.js](http://connect.js) (line 17\)

### 4\. Start the sample application

$ pnpm start

### 5\. Open the sample application [http://localhost:8000](http://localhost:8000)

### 6\. Log in using the following credentials

User: user\_good  
Password: pass\_good

### 7\. Follow the link flow to generate a public\_token

Open the browser inspector to get the public\_token and link\_token\_id from the console

### 8\. Tokenize the bank account

[Call API 2](#2.-tokenize-verified-bank-account)

### Notes:

After finishing the auth flow, the app stores credentials in a JSON file: user\_files/user\_data\_\*.json  
The USER\_ID in a .env file and can be manually incremented to start auth with a new user (useful to test error scenarios)

Alternatively, delete the user\_files/user\_data\_\*.json to start auth with the same user (USER\_ID=1)

# APIs:

### 1\. Create a link token: {#1.-create-a-link-token:}

POST /v1/plaid/{{test\_account}}/link

(optional body)

{  
  "checkout\_id": "cho\_514EDK8EaH6cTYEGCtnoWl"  
}

### 2\. Tokenize verified bank account {#2.-tokenize-verified-bank-account}

POST /v1/plaid/{{test\_account}}/tokenize

Body:

{  
  "link\_token\_id": "plt\_3xoEwGzj1y0TqASmhAlSEY",  
  "public\_token": "public-sandbox-626a7107-0bef-4156-8d10-e8903fdc6fd4",  
  "payment\_method\_group\_id": "123"  
}

Note: payment\_method\_group is optional

