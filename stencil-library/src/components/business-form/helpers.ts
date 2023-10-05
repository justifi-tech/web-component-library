// These props should not be sent to the server
export const parseForPatching = (data) => {
  delete data.id;
  delete data.documents;
  delete data.bank_accounts;
  delete data.product_categories;
  delete data.created_at;
  delete data.updated_at;
  delete data.legal_address.id;
  delete data.legal_address.created_at;
  delete data.legal_address.updated_at;
  delete data.representative.id;
  delete data.representative.documents;
  delete data.representative.created_at;
  delete data.representative.updated_at;
  delete data.representative.address.id;
  delete data.representative.address.created_at;
  delete data.representative.address.updated_at;
  delete data.owners;

  return data;
}
