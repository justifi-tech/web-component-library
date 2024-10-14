import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'date-filter'
})
export class DateFilter {
  @Prop() name: string;
  @Prop() label: string;
  @Prop() params: any;
  @Prop() placeholder?: string;

  @Event() emitParams: EventEmitter<any>;

  private handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.emitParams.emit({ [this.name]: target.value });
  }

  render() {
    return (
      <div class='form-group d-flex flex-column'>
        <label part='label' class='form-label' htmlFor={this.name}>
          {this.label}
        </label>
        <input
          type='date'
          name={this.name}
          value={this.params[this.name] || ''}
          placeholder={this.placeholder}
          onInput={(e) => this.handleInput(e)}
          part={'input'}
          class={'form-control'}
        />
      </div>
    );
  }
}
