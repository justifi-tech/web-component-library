// These props should not be sent to the server
export const parseForPatching = (values, initialValues) => {
  delete values.id;
  delete values.documents;
  delete values.bank_accounts;
  delete values.product_categories;
  delete values.created_at;
  delete values.updated_at;
  delete values.legal_address?.id;
  delete values.legal_address?.created_at;
  delete values.legal_address?.updated_at;
  delete values.representative?.id;
  delete values.representative?.documents;
  delete values.representative?.created_at;
  delete values.representative?.updated_at;
  delete values.representative?.address.id;
  delete values.representative?.address.created_at;
  delete values.representative?.address.updated_at;
  delete values.representative?.business_id;
  initialValues.owners?.length && delete values.owners;

  return values;
}
