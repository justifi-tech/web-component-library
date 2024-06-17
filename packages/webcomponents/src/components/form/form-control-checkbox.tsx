import {
  Component,
  Host,
  h,
  Prop,
  Event,
  EventEmitter,
  Watch,
} from '@stencil/core';

@Component({
  tag: 'form-control-checkbox',
  styleUrl: 'form-control-checkbox.scss',
  shadow: true,
})
export class CheckboxInput {
  checkboxElement!: HTMLInputElement;

  @Prop() label: string;
  @Prop() name: any;
  @Prop() error: string;
  @Prop() defaultValue?: boolean;
  @Prop() inputHandler: (name: string, value: boolean) => void;
  @Prop() disabled: boolean;
  @Event() formControlInput: EventEmitter<any>;
  @Event() formControlBlur: EventEmitter<any>;

  @Watch('defaultValue')
  handleDefaultValueChange(newValue: boolean) {
    this.updateInput(newValue);
  }

  updateInput(newValue: any) {
    this.checkboxElement.checked = newValue;
  }

  handleFormControlInput(event: any) {
    const target = event.target;
    const name = target.getAttribute('name');
    this.inputHandler(name, target.checked);
    this.formControlInput.emit(target.checked);
  }

  componentDidLoad() {
    this.updateInput(this.defaultValue);
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <div class="form-check">
          <label part="label" class="form-check-label" htmlFor={this.name}>
            {this.label}
          </label>
          <input
            ref={el => (this.checkboxElement = el as HTMLInputElement)}
            type="checkbox"
            id={this.name}
            name={this.name}
            onInput={(event: any) => this.handleFormControlInput(event)}
            onBlur={() => this.formControlBlur.emit()}
            part={`input-checkbox ${this.error ? 'input-checkbox-invalid' : ''}`}
            class={this.error ? 'form-check-input is-invalid' : 'form-check-input'}
            disabled={this.disabled}
          />
          {this.error && <div class="invalid-feedback">{this.error}</div>}
        </div>
      </Host>
    );
  }
}
