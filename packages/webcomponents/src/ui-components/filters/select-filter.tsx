import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'select-filter'
})
export class SelectFilter {
  @Prop() name: string;
  @Prop() label: string;
  @Prop() options: { label: string; value: string }[];
  @Prop() params: any;
  @Event() setParamsOnChange: EventEmitter<any>;

  // private renderValue(selected: string) {
  //   return this.t(`${this.optionTranslationKey}.${selected}`);
  // }

  private handleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.setParamsOnChange.emit({ [this.name]: target.value });
  }
  

  render() {
    return (
      <div class="form-group">
        <label class="form-label">
          {this.label}
        </label>
        <select
          name={this.name}
          class="form-control"
          // value={this.params[this.name] || ''}
          onChange={(e) => this.handleChange(e)}
        >
          <option value="">All</option>
          {this.options.map((option: { label: string; value: string }, index) => (
            <option value={option.value} key={index}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
}
