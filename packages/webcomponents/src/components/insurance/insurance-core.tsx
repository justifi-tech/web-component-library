import { Component, h, Host, Prop, State, Event, EventEmitter } from "@stencil/core";
import { ComponentError } from "../../api/ComponentError";

@Component({
  tag: 'justifi-insurance-core',
  shadow: true,
})
export class InsuranceCore {
  @Prop() getQuote: Function;

  @State() quote: any;
  @State() isLoading: boolean = false;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;

  componentWillLoad() {
    if (this.getQuote) {
      this.fetchData();
    }
  };


  fetchData(): void {
    this.isLoading = true;
    this.getQuote({
      onSuccess: ({ quote }) => {
        this.quote = quote
        this.isLoading = false;
      },
      onError: ({ error, code, severity }) => {
        this.isLoading = false;
        this.errorEvent.emit({
          errorCode: code,
          message: error,
          severity,
        });
      }
    });
  };

  render() {
    return (
      <Host>
        <div>{JSON.stringify(this.quote)}</div>
      </Host>
    );
  }
};