import { Component, Prop, h, Event, EventEmitter } from "@stencil/core";
import { StyledHost } from "../styled-host/styled-host";

@Component({
  tag: 'justifi-radio-list-item',
  shadow: true,
})
export class JustifiRadioListItem {
  @Prop() name!: string;
  @Prop() value!: string;
  @Prop() label!: any;
  @Prop() checked?: boolean = false;
  @Prop() hidden?: boolean = false;
  @Prop() class?: string;

  @Event({ eventName: 'radio-click' }) radioClick: EventEmitter<string>;

  render() {
    return (
      <StyledHost>
        <radio-list-item
          name={this.name}
          value={this.value}
          label={this.label}
          checked={this.checked}
          hidden={this.hidden}
          class={this.class}
          onRadio-click={(e: CustomEvent<string>) => this.radioClick.emit(e.detail)}
        />
      </StyledHost>
    );
  }
} 
