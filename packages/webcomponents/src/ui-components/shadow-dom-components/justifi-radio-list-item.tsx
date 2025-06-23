import { Component, Prop, h, Event, EventEmitter } from "@stencil/core";
import { StyledHost } from "../styled-host/styled-host";
import { radioListItem } from "../../styles/parts";

@Component({
  tag: 'justifi-radio-list-item',
  shadow: true,
})
export class JustifiRadioListItem {
  @Prop() name!: string;
  @Prop() value!: string;
  @Prop() label!: string;
  @Prop() checked?: boolean = false;
  @Prop() hidden?: boolean = false;
  @Prop() class?: string;

  @Event({ eventName: 'radio-click' }) radioClick: EventEmitter<string>;

  handleClick = () => {
    this.radioClick.emit(this.value);
  };

  render() {
    return (
      <StyledHost>
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
          />
        </div>
      </StyledHost>
    );
  }
} 
