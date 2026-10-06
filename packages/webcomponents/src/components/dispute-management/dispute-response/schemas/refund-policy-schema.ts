import { object, string } from 'yup';

const RefundPolicySchema = object({
  refund_policy_disclosure: string().nullable(),
  refund_refusal_explanation: string().nullable(),
});

export default RefundPolicySchema;