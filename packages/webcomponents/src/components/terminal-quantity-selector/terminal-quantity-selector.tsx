import { Component, Event, EventEmitter, h, Prop, State } from "@stencil/core";
import { buttonLink, image, link, text } from "../../styles/parts";

@Component({
  tag: 'terminal-quantity-selector',
  shadow: false,
})
export class TerminalQuantitySelector {
  @Prop() terminalId: string;
  @Prop() modelName: string;
  @Prop() imageUrl: string;
  @Prop() description: string;
  @Prop() helpUrl: string;
  @Prop() limit: number = Infinity;

  @State() selectedQuantity: number = 0;

  @Event() selectedQuantityChange: EventEmitter<{ terminalId: string, quantity: number }>;

  private removeUnity = () => {
    if (this.selectedQuantity > 0) {
      this.selectedQuantity--;
      this.selectedQuantityChange.emit({ terminalId: this.terminalId, quantity: this.selectedQuantity });
    }
  }

  private addUnity = () => {
    if (this.limit > 0) {
      this.selectedQuantity++;
      this.selectedQuantityChange.emit({ terminalId: this.terminalId, quantity: this.selectedQuantity });
    }
  }

  render() {
    return (
      <div class="mt-4 rounded shadow-sm" part={text}>
        <div class="d-flex gap-3">
          <div>
            <img src={this.imageUrl} alt={this.modelName} height={125} width={125} part={image} />
          </div>

          <div class="d-flex flex-column flex-grow-1 gap-3 p-4">
            <div class="d-flex row flex-row">
              <div class="col-6">{this.modelName}</div>
              <div class="col-6 d-flex justify-content-end">
                <a part={link} href={this.helpUrl}>Learn more</a>
              </div>
            </div>

            <div class="row">
              <div class="col-6">{this.description}</div>
              <div class="col-6 d-flex justify-content-end">
                <button class="p-0 minus" onClick={this.removeUnity} part={buttonLink}>-</button>
                <div class="w-25 text-center">{this.selectedQuantity}</div>
                <button class="p-0 plus" onClick={this.addUnity} part={buttonLink}>+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
