import { Component, Prop, h, Host } from '@stencil/core';
import { radioListItem } from "../styles/parts";

@Component({
  tag: 'radio-list-item',
})
export class RadioListItem {
  @Prop() name!: string;
  @Prop() value!: string;
  @Prop() label!: any;
  @Prop() checked?: boolean = false;
  @Prop() hidden?: boolean = false;
  @Prop() class?: string;

  @Prop() radioClickHandler?: (value: string) => void;

  handleClick = () => {
    this.radioClickHandler?.(this.value);
  };

  render() {
    return (
      <Host>
        <div
          class={`radio-list-item p-3 ${this.class || ''}`}
          part={radioListItem}
          onClick={this.handleClick}
          hidden={this.hidden}
        >
          <form-control-radio
            name={this.name}
            value={this.value}
            checked={this.checked}
            label={this.label}
            inputHandler={() => null}
          />
        </div>
      </Host>
    );
  }
}
