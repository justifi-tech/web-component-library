import { boolean, object, string } from 'yup';

const confirmationMessage = "Please acknowledge that you understand that this information can only be submitted once.";
const AdditionalStatementSchema = object({
  additional_statement: string().nullable(),
  forfeit: boolean().required(confirmationMessage).isFalse(confirmationMessage),
});

export default AdditionalStatementSchema;