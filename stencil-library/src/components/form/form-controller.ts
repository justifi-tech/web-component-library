import { ObjectSchema, ValidationError } from "yup";

class FormController {
  private schema: ObjectSchema<any>;
  private controller = { values: {}, isValid: false, errors: {} };

  get errors(): any {
    return this.controller.errors;
  }

  validate = async () => {
    this.controller.isValid = true;
    this.controller.errors = {};

    try {
      await this.schema.validate(this.controller.values, { abortEarly: false });
    } catch (err) {
      this.controller.isValid = false;
      err.inner.map((item: ValidationError) => {
        this.controller.errors[item.path] = item.message;
      });
    }
    return this.controller;
  };

  register = (name) => {
    return {
      name: name || '',
      onInput: (e) => {
        this.controller.values[name] = e.target.value;
      }
    }
  };

  constructor(schema: ObjectSchema<any>) {
    this.schema = schema;
  }
}

export default FormController;