import { object, string } from 'yup';

const ElectronicEvidenceSchema = object({
  customer_purchase_ip_address: string().nullable(),
  access_activity_log: string().nullable(),
});

export default ElectronicEvidenceSchema;