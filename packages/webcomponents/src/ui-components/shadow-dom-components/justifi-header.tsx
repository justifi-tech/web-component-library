import { Component, Prop, h } from "@stencil/core";
import { StyledHost } from "../styled-host/styled-host";
import { Header1 } from "../headers/header-1";
import { Header2 } from "../headers/header-2";
import { Header3 } from "../headers/header-3";

@Component({
  tag: 'justifi-header',
  shadow: true,
})
export class Header {
  levels = {
    h1: Header1,
    h2: Header2,
    h3: Header3,
  }

  @Prop() text: string;
  @Prop() level: keyof typeof this.levels = 'h1';
  @Prop() class?: string;

  render() {
    const HeaderComponent = this.levels[this.level];

    return (
      <StyledHost>
        <HeaderComponent text={this.text} class={this.class} />
      </StyledHost>
    );
  }
}
