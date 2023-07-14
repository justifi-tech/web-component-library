import { Component, Host, h, Prop, Event, EventEmitter, Listen, Watch } from '@stencil/core';
import { ValidationError } from 'yup';

@Component({
  tag: 'form-component',
  styleUrl: 'form-component.scss',
  shadow: true,
})
export class TextInput {
  @Prop() form: any;
  @Prop() defaultValues: any;
  @Event() validFormSubmitted: EventEmitter;
  @Event() updateFormState: EventEmitter<any>;

  @Watch('form')
  handleFormChange(newValue: any) {
    this.updateFormState.emit(newValue);
  }

  @Listen('updateFormValues')
  handleFormValuesUpdate(event: CustomEvent) {
    this.form = { ...this.form, values: { ...this.form.values, ...event.detail } };
  };

  @Listen('formControlBlur')
  handleFormControlBlur() {
    if (!this.form.isValid) {
      this.validate(this.form.schema);
    }
  };

  validate = async (schema): Promise<{ isValid: boolean, errors: any, values: any }> => {
    this.form.isValid = true
    this.form.errors = {};

    try {
      await schema.validate(this.form.values, { abortEarly: false });
    } catch (err) {
      this.form.isValid = false;
      err.inner.map((item: ValidationError) => {
        this.form.errors[item.path] = item.message;
      });
    }
    this.form = { ...this.form };
    return this.form.isValid;
  };

  async submit(event, schema) {
    event.preventDefault();
    console.log('submit', this.form.values)
    const formIsValid = await this.validate(schema);
    if (formIsValid) this.validFormSubmitted.emit(this.form.values);
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <form onSubmit={(event) => this.submit(event, this.form.schema)}>
          <div class="row gy-3">
            <div class="col-12">
              <slot />
            </div>
          </div>
          <div class="row gy-3">
            <div class="col-12">
              <button type="submit" class="btn btn-primary">Submit</button>
            </div>
          </div>
        </form>
      </Host>
    );
  }
}