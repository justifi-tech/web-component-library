import {
  Component,
  Host,
  h,
  Prop,
  Event,
  EventEmitter,
  State,
} from '@stencil/core';

@Component({
  tag: 'form-control-date',
  styleUrl: 'form-control-number.scss',
  shadow: true,
})
export class DateInput {
  @Prop() label: string;
  @Prop() name: string;
  @Prop() error: string;
  @Prop() defaultValue: string;
  @Prop() inputHandler: any;
  @Prop() disabled: boolean;
  @State() date: string

  dateInput!: HTMLInputElement;

  @Event() formControlInput: EventEmitter<any>;
  @Event() formControlBlur: EventEmitter<any>;


  private updateInput(value: any) {
    this.dateInput.value = value;
  }

  // componentDidLoad() {
  //   this.updateInput(this.defaultValue);
  // }

  componentDidUpdate() {
    this.updateInput(this.defaultValue || '');
  }

  handleFormControlInput = (event: any) => {
    const target = event.target;
    const name = target.getAttribute('name');
    this.inputHandler(name, target.value);
    this.formControlInput.emit(target.value);
  }

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
          onChange={this.handleFormControlInput}
          part={`input ${this.error && 'input-invalid'}`}
          class={this.error ? 'form-control is-invalid' : 'form-control'}
          disabled={this.disabled}
        />
        {this.error && <span part="input-invalid">{this.error}</span>}
      </Host>
    );
  }

}

