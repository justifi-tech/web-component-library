import { Component, Prop, h, State, Event, EventEmitter } from '@stencil/core';
import { createPopper, Options, Placement, PositioningStrategy } from '@popperjs/core';

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

  @Event() showEvent: EventEmitter;
  @Event() hideEvent: EventEmitter;

  private popperInstance: any;
  private popperContentRef: HTMLElement;

  componentDidLoad() {
    this.popperInstance = createPopper(this.anchorRef, this.popperContentRef, this.popperOptions);

    if (this.trigger === 'click') {
      window.addEventListener('click', this.handleClick.bind(this));
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

  disconnectedCallback() {
    if (this.trigger === 'click') {
      window.removeEventListener('click', this.handleClick.bind(this));
    }
    else if (this.trigger === 'hover') {
      this.anchorRef.removeEventListener('mouseenter', this.show.bind(this));
      this.anchorRef.removeEventListener('mouseleave', this.hide.bind(this));
      this.popperContentRef.removeEventListener('mouseenter', this.show.bind(this));
      this.popperContentRef.removeEventListener('mouseleave', this.hide.bind(this));
    } else if (this.trigger === 'focus') {
      this.anchorRef.removeEventListener('focus', this.show.bind(this));
      this.anchorRef.removeEventListener('blur', this.hide.bind(this));
    }
  }

  handleClick(event: MouseEvent) {
    const path = event.composedPath();
    const isAnchorClicked = path.includes(this.anchorRef);
    const isPopperContentClicked = path.includes(this.popperContentRef);

    if (!this.isOpen && isAnchorClicked) {
      this.show();
    } else if (this.isOpen && !isPopperContentClicked) {
      this.hide();
    } else if (this.isOpen && isAnchorClicked) {
      this.hide();
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
    this.isOpen = true;
    this.popperContentRef.setAttribute('data-show', '');
    this.popperInstance.update();
    this.showEvent.emit();
  }

  hide(){
    this.isOpen = false;
    this.popperContentRef.removeAttribute('data-show');
    this.popperInstance.update();
    this.hideEvent.emit();
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
            z-index: 1030;
          }
          `}
        </style>

      <div class="popper-content" ref={(el) => this.popperContentRef = el }>
        <slot></slot>
      </div>
      </div>
    );
  }
}
