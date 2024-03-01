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

export const parseRepresentativeInfo = (values: any) => {
  delete values.id;
  delete values.documents;
  delete values.created_at;
  delete values.updated_at;
  delete values.address.id;
  delete values.address.created_at;
  delete values.address.updated_at;
  delete values.business_id;

  return values;
}
