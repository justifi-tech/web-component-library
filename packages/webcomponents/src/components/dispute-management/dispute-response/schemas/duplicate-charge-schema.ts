import { object, string } from 'yup';

const DuplicateChargeSchema = object({
  duplicate_charge_original_payment_id: string().nullable(),
  duplicate_charge_explanation: string().nullable(),
});

export default DuplicateChargeSchema;