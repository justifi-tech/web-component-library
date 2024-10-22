import { Component, h, Prop, Event, EventEmitter, State, Watch } from '@stencil/core';

@Component({
  tag: 'select-filter'
})
export class SelectFilter {
  selectElement: HTMLSelectElement;

  @State() currentValue: string = '';
  @State() stateOptions: { label: string; value: string }[] = [];

  @Prop() name: string;
  @Prop() label: string;
  @Prop() options: { label: string; value: string }[];
  @Prop() params: any;

  @Watch('params')
  clearInput() {
    if (!this.params[this.name]) {
      this.currentValue = '';
    }
  }

  componentWillLoad() {
    this.stateOptions = this.options;
  }

  @Event() emitParams: EventEmitter<any>;

  private handleChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    this.currentValue = target.value;
    this.emitParams.emit({ [this.name]: target.value });
  }

  render() {
    return (
      <div class='form-group'>
        <label class='form-label' htmlFor={this.name}>
          {this.label}
        </label>
        <select
          name={this.name}
          ref={(el) => (this.selectElement = el as HTMLSelectElement)}
          class='form-control'
          onChange={this.handleChange}
          part={'input'}
        >
          {this.stateOptions.map((option, index) => (
            <option value={option.value} key={index} selected={this.currentValue === option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
}
