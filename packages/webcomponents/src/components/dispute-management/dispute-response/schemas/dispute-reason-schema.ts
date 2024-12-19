import { object, string } from 'yup';

const DisputeResponseSchema = object({
  reason: string().required('Dispute reason is required')
});

export default DisputeResponseSchema;