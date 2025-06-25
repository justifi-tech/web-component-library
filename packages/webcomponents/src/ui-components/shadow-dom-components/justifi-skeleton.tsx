import { Component, Prop, h } from "@stencil/core";
import { StyledHost } from "../styled-host/styled-host";
import { Skeleton } from "../skeleton";

@Component({
  tag: 'justifi-skeleton',
  shadow: true,
})
export class JustifiSkeleton {
  @Prop() component?: string;
  @Prop() height?: string | number;
  @Prop() width?: string | number;
  @Prop() class?: string;
  @Prop() customStyle?: { [key: string]: any };

  render() {
    return (
      <StyledHost>
        <Skeleton
          component={this.component}
          height={this.height}
          width={this.width}
          className={this.class}
          styles={this.customStyle}
        />
      </StyledHost>
    );
  }
}
