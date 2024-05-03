import {
  Component,
  Host,
  h,
  Prop,
  Event,
  EventEmitter,
} from '@stencil/core';

@Component({
  tag: 'form-control-date',
  styleUrl: 'form-control-number.scss',
  shadow: true,
})
export class DatePartInput {
  @Prop() label: string;
  @Prop() name: string;
  @Prop() error: string;
  @Prop() defaultValue: Date;
  @Prop() inputHandler: any;
  @Prop() disabled: boolean;

  dateInput!: HTMLInputElement;

  @Event() formControlInput: EventEmitter<any>;
  @Event() formControlBlur: EventEmitter<any>;

  // private dateToObject(date: Date) {
  //   return {
  //     dob_day: date.getDate().toString(),
  //     dob_month: (date.getMonth() + 1).toString(), // Months are 0-based in JavaScript
  //     dob_year: date.getFullYear().toString(),
  //   };
  // }

  // private updateInput(value: string) {
  //   const date = new Date(value);
  //   this.dateInput.valueAsDate = date;
  // }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <label part="label" class="form-label" htmlFor={this.name}>
          {this.label}
        </label>
        <input
          type="date"
          ref={el => (this.dateInput = el as HTMLInputElement)}
          id={this.name}
          name={this.name}
          onBlur={this.formControlBlur.emit}
          onChange={(e) => {
            // const date = new Date(e.target.value);
            // const dob = this.dateToObject(date);
            console.log(e);
            // Now you can use dob to update your state or send it to your server
          }}
          part={`input ${this.error && 'input-invalid'}`}
          class={this.error ? 'form-control is-invalid' : 'form-control'}
          disabled={this.disabled}
        />
        {this.error && <span part="input-invalid">{this.error}</span>}
      </Host>
    );
  }

}

