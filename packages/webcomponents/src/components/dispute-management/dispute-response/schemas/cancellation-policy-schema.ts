import { object, string } from 'yup';

const CancellationPolicySchema = object({
  cancellation_policy_disclosure: string().nullable(),
  cancellation_rebuttal: string().nullable(),
});

export default CancellationPolicySchema;