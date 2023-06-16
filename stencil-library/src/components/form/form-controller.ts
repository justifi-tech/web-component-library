import { ObjectSchema, ValidationError } from "yup";

class FormController {
  private schema: ObjectSchema<any>;
  private controller = { values: {}, isValid: false, errors: {} };

  get errors(): any {
    return this.controller.errors;
  }

  validate = async () => {
    console.log(this.controller.values)
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
    const fieldNameKeys = name.split('.');
    return {
      name: name || '',
      value: '',
      onInput: (e) => {
        const controllerValue = fieldNameKeys.reduceRight((obj, elem) => ({ [elem]: obj }), e.target.value);
        this.controller.values = { ...this.controller.values, ...controllerValue };
      },
    }
  };

  constructor(defaultValues: any, schema: ObjectSchema<any>) {
    this.controller.values = defaultValues;
    this.schema = schema;
  }
}

export default FormController;