import { Component, h, Prop, Event, EventEmitter, State, Watch } from '@stencil/core';

@Component({
  tag: 'text-filter'
})
export class TextFilter {
  textElement: HTMLInputElement;

  @Prop() name: string;
  @Prop() label: string;
  @Prop() params: any;
  @Prop() placeholder?: string;

  @State() currentValue: string = '';

  @Event() emitParams: EventEmitter<any>;

  private handleInput = (event: Event) => {
    event.preventDefault();
    const target = event.target as HTMLInputElement;
    this.currentValue = target.value;
    this.emitParams.emit({ [this.name]: target.value });
  }

  @Watch('params')
  clearInput() {
    if (!this.params[this.name]) {
      this.currentValue = '';
    }
  }
  
  render() {
    return (
      <div class='form-group d-flex flex-column'>
        <label part='label' class='form-label' htmlFor={this.name}>
          {this.label}
        </label>
        <input
          type='text'
          name={this.name}
          ref={(el) => (this.textElement = el as HTMLInputElement)}
          value={this.currentValue}
          placeholder={this.placeholder}
          onInput={this.handleInput}
          part={'input'}
          class={'form-control'}
        />
      </div>
    );
  }
}
