import { Component, Prop, h, Element, State } from '@stencil/core';
import { createPopper, Options, Placement, PositioningStrategy } from '@popperjs/core';
// import { StyledHost } from '../styled-host/styled-host';

@Component({
  tag: 'custom-popper',
})
export class CustomPopper {
  @Prop() placement: Placement = 'bottom';
  @Prop() offset: [number, number] = [0, 10];
  @Prop() strategy: PositioningStrategy = 'absolute';
  @Prop() trigger: string = 'click'; // 'click', 'hover', 'focus'
  @Prop() anchorRef: HTMLElement;

  @State() isOpen: boolean = false;

  @Element() el: HTMLElement;

  private popperInstance: any;
  private popperContentRef: HTMLElement;

  componentDidLoad() {
    this.popperInstance = createPopper(this.anchorRef, this.popperContentRef, this.popperOptions);
    console.log('popperInstance', this.popperInstance);

    if (this.trigger === 'click') {
      // this.anchorRef.addEventListener('click', this.show.bind(this));

      window.addEventListener('click', (event) => {
        let isPopperContent = event.target === this.popperContentRef;
        let isPopperContentChild = this.popperContentRef.contains(event.target as Node);

        console.log('isPopperContent', isPopperContent);
        console.log('isPopperContentChild', isPopperContentChild);
        console.log('event.target', event.target);
        
        if (event.target === this.anchorRef) {
          this.show();
        } else if (this.isOpen && !isPopperContent && !isPopperContentChild) {
          this.hide();
        }
      }
    )

    } else if (this.trigger === 'hover') {
      this.anchorRef.addEventListener('mouseenter', this.show.bind(this));
      this.anchorRef.addEventListener('mouseleave', this.hide.bind(this));
      this.popperContentRef.addEventListener('mouseenter', this.show.bind(this));
      this.popperContentRef.addEventListener('mouseleave', this.hide.bind(this));

    } else if (this.trigger === 'focus') {
      this.anchorRef.addEventListener('focus', this.show.bind(this));
      this.anchorRef.addEventListener('blur', this.hide.bind(this));
    }
  }

  

  private get popperOptions(): Options {
    return {
      placement: this.placement,
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: this.offset,
          },
        },
      ],
      strategy: this.strategy,
    };
  }

  show() {
    console.log('show runs');
    this.isOpen = true;
    this.popperContentRef.setAttribute('data-show', '');
  }

  hide(){
    console.log('hide runs');
    this.isOpen = false;
    this.popperContentRef.removeAttribute('data-show');
  }


  render() {
    return (
      <div>
        <style>
          {`
          .popper-content {
            display: none;
          }
          .popper-content[data-show] {
            display: block;
          }
          `}
        </style>

      <div class='popper-content' ref={(el) => this.popperContentRef = el }>
        <slot></slot>
      </div>
      </div>
    );
  }
}