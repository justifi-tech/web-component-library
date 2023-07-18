import { BehaviorSubject } from "rxjs";
import { ObjectSchema, ValidationError } from "yup";

export class FormController {
  public values: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public defaultValues: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public errors: BehaviorSubject<any> = new BehaviorSubject<any>({});

  private _schema: ObjectSchema<any>;
  private _values: any = {};
  private _errors: any = {};
  private _isValid = true;

  constructor(schema: ObjectSchema<any>) {
    this._schema = schema;
  }

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

  private async validate(): Promise<boolean> {
    this._isValid = true
    this._errors = {};

    try {
      await this._schema.validate(this._values, { abortEarly: false });
    } catch (err) {
      this._isValid = false;
      const newErrors = {};
      err.inner.map((item: ValidationError) => {
        this.setError(newErrors, item.path, item.message);
      });
      this._errors = newErrors;
    }

    this.errors.next(this._errors);
    return this._isValid;
  };

  public async validateAndSubmit(submitHandler: () => void): Promise<void> {
    const isValid = await this.validate();
    if (isValid) {
      submitHandler();
    }
  }

  public setValues(values): void {
    this._values = { ...this._values, ...values };
    this.values.next(this._values);
  }
}
