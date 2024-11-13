import { object, string } from 'yup';

export const disputeResponseSchema = () => {
  const schema = object({
    reason: string().required('Dispute reason is required')
  });

  return schema;
}