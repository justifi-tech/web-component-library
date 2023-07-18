import { ObjectSchema, ValidationError } from "yup";

class FormState {
  values: any = {};
  errors: any = {};
  defaultValues: any = {};
  schema?: ObjectSchema<any>;

  update = (obj: any) => {
    console.log(obj)
    this.values = { ...this.values, ...obj };
  };

  private setError(obj, path, message: string) {
    var properties = Array.isArray(path) ? path : path.split(".");
    var property = properties.shift();
    obj[property] = obj[property] || {};
    if (properties.length) {
      this.setError(obj[property], properties, message);
    } else {
      obj[property] = message;
    }
    return obj;
  }

  isValid = async (schema): Promise<boolean> => {
    let isValid = true
    this.errors = {};

    try {
      await schema.validate(this.values, { abortEarly: false });
    } catch (err) {
      isValid = false;
      const newErrors = {};
      err.inner.map((item: ValidationError) => {
        this.setError(newErrors, item.path, item.message);
      });
      this.errors = newErrors
    }

    return isValid;
  };

  constructor(schema: ObjectSchema<any>, defaultValues: any) {
    this.schema = schema;
    this.defaultValues = defaultValues || {};
  };

}

export default FormState;