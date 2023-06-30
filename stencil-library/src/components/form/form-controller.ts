import { ObjectSchema, ValidationError } from "yup";

class FormController {
  private defaultValues: any = {};
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

  reset = () => {
    this.controller.values = this.defaultValues;
    this.controller.isValid = false;
    this.controller.errors = {};
  }

  getFormError(name: string) {
    const path = name.split('.');
    return path.reduce((acc, part) => acc && acc[part], this.controller.errors);
  }

  getFormValue(name: string) {
    const path = name.split('.');
    return path.reduce((acc, part) => acc && acc[part], this.controller.values);
  }

  setFormValue(name: string, value: any) {
    const path = name.split('.');
    let newControllerValue = {};
    path.reduce((acc, part, index) => {
      if (index === path.length - 1) {
        acc[part] = value;
      } else {
        acc[part] = acc[part] || {};
      }
      return acc[part];
    }, newControllerValue);
    this.controller.values = { ...this.controller.values, ...newControllerValue };
  }

  register = (name) => {
    const defaultValue = this.getFormValue(name);

    const onInput = (e) => {
      this.setFormValue(name, e.target.value);
      console.log(this.controller.values)
    };

    return {
      name: name || '',
      value: defaultValue || '',
      onInput: onInput,
      // error: () => this.getFormError(name) || '',
    }
  };

  constructor(defaultValues: any, schema: ObjectSchema<any>) {
    this.defaultValues = defaultValues;
    this.controller.values = defaultValues;
    this.schema = schema;
  }
}

export default FormController;