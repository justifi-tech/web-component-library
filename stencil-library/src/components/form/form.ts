import { ObjectSchema } from "yup";

class FormState {
  values: any;
  errors: any;
  isValid: boolean;
  defaultValues: any;
  schema?: ObjectSchema<any>;
  constructor(defaultValues: any, schema?: ObjectSchema<any>) {
    this.defaultValues = defaultValues || {};
    this.values = {};
    this.errors = {};
    this.isValid = true;

    if (schema) {
      this.schema = schema;
    }
  };
}

export default FormState;