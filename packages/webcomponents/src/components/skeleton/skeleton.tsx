import { Component, Prop, h, Host } from '@stencil/core';

@Component({
  tag: 'justifi-skeleton',
  styleUrl: 'skeleton.css',
  shadow: true,
})
export class Skeleton {
  @Prop() component: string = 'div';
  @Prop() height: string | number;
  @Prop() width: string | number;
  @Prop() variant: 'circular' | 'rectangular' | 'rounded' | 'text' = 'text';
  @Prop() componentClassName: string;
  @Prop() styles: { [key: string]: any };

  private getVariantStyle() {
    if (this.variant === 'text') {
      return {
        marginTop: 0,
        marginBottom: 0,
        height: 'auto',
        transformOrigin: '0 55%',
        transform: 'scale(1, 0.60)',
        borderRadius: '4px/6.67px',
        '::before': {
          content: '"\\00a0"',
        },
      };
    } else if (this.variant === 'circular') {
      return {
        borderRadius: '50%',
      };
    } else if (this.variant === 'rounded') {
      return {
        borderRadius: '4px',
      };
    }
    return {};
  }

  render() {
    const TagType = this.component as any;

    const combinedStyle = {
      ...this.styles,
      ...this.getVariantStyle(),
      animation: `pulseAnimation 2s ease-in-out 0.5s infinite`,
      width: this.width,
      height: this.height,
      backgroundColor: 'var(--jfi-skeleton-waveAnimation-bg, #f5f5f5)',
    };

    return (
      <Host>
        <TagType class={this.componentClassName} style={combinedStyle} />
      </Host>
    );
  }
}
