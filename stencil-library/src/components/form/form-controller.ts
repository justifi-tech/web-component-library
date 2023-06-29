import { ObjectSchema, ValidationError } from "yup";

class FormController {
  private defaultValues: any = {};
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

  getFormValue(obj, name: string) {
    const path = name.split('.');
    return path.reduce((acc, part) => acc && acc[part], obj);
  }

  register = (name) => {
    const defaultValue = this.getFormValue(this.defaultValues, name);

    const onInput = (e) => {
      return this.controller.values[name] = e.target.value;
    };

    return {
      name: name || '',
      value: defaultValue || '',
      onInput: onInput,
    }
  };

  constructor(defaultValues: any, schema: ObjectSchema<any>) {
    this.defaultValues = defaultValues;
    this.schema = schema;
  }
}

export default FormController;