import { Component, h, Prop, Event, EventEmitter, State, Watch } from '@stencil/core';

@Component({
  tag: 'date-filter'
})
export class DateFilter {
  @State() currentValue: string = '';
  
  @Prop() name: string;
  @Prop() label: string;
  @Prop() params: any;
  @Prop() placeholder?: string;

  @Event() emitParams: EventEmitter<any>;

  @Watch('params')
  clearInput() {
    if (!this.params[this.name]) {
      this.currentValue = '';
    }
  }

  private handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    this.currentValue = target.value;
    this.emitParams.emit({ [this.name]: target.value });
  }

  render() {
    return (
      <div class="form-group d-flex flex-column">
        <label part="label" class="form-label" htmlFor={this.name}>
          {this.label}
        </label>
        <input
          type="date"
          name={this.name}
          value={this.currentValue}
          placeholder={this.placeholder}
          onChange={this.handleChange}
          part={"input"}
          class={"form-control"}
        />
      </div>
    );
  }
}
