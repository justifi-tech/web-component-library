// These props should not be sent to the server

// This function is for the larger business form. 
export const parseBusiness = (values, initialValues) => {
  parseCoreInfo(values);
  parseAddressInfo(values.legal_address);
  parseIdentityInfo(values.representative);
  initialValues.owners?.length && delete values.owners;

  return values;
}

// These functions are for the stepped business form.
export const parseCoreInfo = (values: any) => {
  delete values.id;
  delete values.documents;
  delete values.bank_accounts;
  delete values.product_categories;
  delete values.created_at;
  delete values.updated_at;

  return values;
};

export const parseAddressInfo = (values: any) => {
  delete values.id;
  delete values.created_at;
  delete values.updated_at;

  return values;
}

export const parseIdentityInfo = (values: any) => {
  delete values.id;
  delete values.documents;
  delete values.created_at;
  delete values.updated_at;
  delete values.address.id;
  delete values.address.created_at;
  delete values.address.updated_at;
  delete values.business_id
  delete values.dob_full;

  return values;
}
