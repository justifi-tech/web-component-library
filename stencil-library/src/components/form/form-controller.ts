import { ObjectSchema, ValidationError } from "yup";

class FormController {
  private defaultValues: any = {};
  private schema: ObjectSchema<any>;
  private controller = { values: {}, isValid: false, errors: {} };

  get errors(): any {
    return this.controller.errors;
  }

  validate = async () => {
    const newController = {
      isValid: true,
      errors: {}
    }

    try {
      await this.schema.validate(this.controller.values, { abortEarly: false });
    } catch (err) {
      newController.isValid = false;
      err.inner.map((item: ValidationError) => {
        newController.errors[item.path] = item.message;
      });
    }

    this.controller = { ...this.controller, ...newController };

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
    };

    const onBlur = () => {
      if (!this.controller.isValid) {
        this.validate();
      }
    };

    return {
      name: name || '',
      value: defaultValue || '',
      onInput: onInput,
      onBlur: onBlur,
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