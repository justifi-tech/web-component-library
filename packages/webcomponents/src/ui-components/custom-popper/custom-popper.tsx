import { Component, Prop, h, State, Event, EventEmitter, Watch } from '@stencil/core';
import { createPopper, Options, Placement, PositioningStrategy } from '@popperjs/core';

@Component({
  tag: 'custom-popper',
})
export class CustomPopper {
  @Prop() placement: Placement = 'bottom';
  @Prop() offset: [number, number] = [0, 10];
  @Prop() strategy: PositioningStrategy = 'absolute';
  @Prop() trigger: string = 'click';
  @Prop() anchorRef: HTMLElement | SVGElement;

  @State() isOpen: boolean = false;

  @Event() showEvent: EventEmitter;
  @Event() hideEvent: EventEmitter;

  private popperInstance: any;
  private popperContentRef: HTMLElement;
  private initialized: boolean = false;
  private boundHandlers = {
    show: null as (() => void) | null,
    hide: null as (() => void) | null,
    handleClick: null as ((event: MouseEvent) => void) | null,
  };

  @Watch('anchorRef')
  onAnchorRefChange(newValue: HTMLElement | SVGElement) {
    if (newValue && this.popperContentRef && !this.initialized) {
      this.initPopper();
    }
  }

  componentDidLoad() {
    if (this.anchorRef && this.popperContentRef) {
      this.initPopper();
    }
  }

  private initPopper() {
    if (this.initialized) return;
    this.initialized = true;

    // Store bound references
    this.boundHandlers.show = this.show.bind(this);
    this.boundHandlers.hide = this.hide.bind(this);
    this.boundHandlers.handleClick = this.handleClick.bind(this);

    this.popperInstance = createPopper(this.anchorRef, this.popperContentRef, this.popperOptions);

    if (this.trigger === 'click') {
      window.addEventListener('click', this.boundHandlers.handleClick);
    } else if (this.trigger === 'hover') {
      this.anchorRef.addEventListener('mouseenter', this.boundHandlers.show);
      this.anchorRef.addEventListener('mouseleave', this.boundHandlers.hide);
      this.popperContentRef.addEventListener('mouseenter', this.boundHandlers.show);
      this.popperContentRef.addEventListener('mouseleave', this.boundHandlers.hide);
    } else if (this.trigger === 'focus') {
      this.anchorRef.addEventListener('focus', this.boundHandlers.show);
      this.anchorRef.addEventListener('blur', this.boundHandlers.hide);
    }
  }

  disconnectedCallback() {
    if (!this.initialized) return;

    if (this.trigger === 'click') {
      window.removeEventListener('click', this.boundHandlers.handleClick);
    } else if (this.trigger === 'hover') {
      this.anchorRef?.removeEventListener('mouseenter', this.boundHandlers.show);
      this.anchorRef?.removeEventListener('mouseleave', this.boundHandlers.hide);
      this.popperContentRef?.removeEventListener('mouseenter', this.boundHandlers.show);
      this.popperContentRef?.removeEventListener('mouseleave', this.boundHandlers.hide);
    } else if (this.trigger === 'focus') {
      this.anchorRef?.removeEventListener('focus', this.boundHandlers.show);
      this.anchorRef?.removeEventListener('blur', this.boundHandlers.hide);
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

  hide() {
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

        <div class="popper-content" ref={(el) => this.popperContentRef = el}>
          <slot></slot>
        </div>
      </div>
    );
  }
}
