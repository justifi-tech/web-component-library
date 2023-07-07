import { ObjectSchema, ValidationError } from "yup";

class FormController {
  private defaultValues: any = {};
  private schema: ObjectSchema<any>;
  private _errors: any = {};
  private _values: any = {};
  private _isValid: boolean = false;

  get errors(): any {
    return this._errors;
  }

  validate = async (): Promise<{ isValid: boolean, errors: any, values: any }> => {
    this._isValid = true;
    this._errors = {};

    try {
      await this.schema.validate(this._values, { abortEarly: false });
    } catch (err) {
      this._isValid = false;
      err.inner.map((item: ValidationError) => {
        this._errors[item.path] = item.message;
      });
    }

    return { isValid: this._isValid, errors: this._errors, values: this._values };
  };

  reset = () => {
    this._values = this.defaultValues;
    this._isValid = false;
    this._errors = {};
  }

  getFormError(name: string) {
    const path = name.split('.');
    return path.reduce((acc, part) => acc && acc[part], this._errors);
  }

  getFormValue(name: string) {
    const path = name.split('.');
    return path.reduce((acc, part) => acc && acc[part], this._values);
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

    this._values = { ...this._values, ...newControllerValue };
  }

  register = (name) => {
    const defaultValue = this.getFormValue(name);
    const onInput = (e) => this.setFormValue(name, e.target.value);
    const onBlur = () => {
      if (!this._isValid) this.validate();
    };

    return {
      name: name || '',
      value: defaultValue || '',
      onInput: onInput,
      onBlur: onBlur
    }
  };

  constructor(defaultValues: any, schema: ObjectSchema<any>) {
    this.defaultValues = defaultValues;
    this.schema = schema;
    this._values = defaultValues;
  }
}

export default FormController;