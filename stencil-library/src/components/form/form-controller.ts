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

  register = (name) => {
    const splitName = name.split('.');
    const isNested = splitName.length > 1;
    let onInput: (e: any) => void;
    let defaultValue: string;

    if (isNested) {
      this.controller.values[splitName[0]] = {};
      const defaultValueSection = this.defaultValues[splitName[0]]
      if (defaultValueSection) {
        defaultValue = defaultValueSection[splitName[1]];
      }
      onInput = (e) => {
        return this.controller.values[splitName[0]][splitName[1]] = e.target.value;
      };
    } else {
      defaultValue = this.defaultValues[name];
      onInput = (e) => {
        return this.controller.values[name] = e.target.value;
      };
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