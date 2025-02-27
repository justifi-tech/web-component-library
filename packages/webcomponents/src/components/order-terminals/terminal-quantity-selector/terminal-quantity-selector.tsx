import { Component, Event, EventEmitter, h, Prop, State } from "@stencil/core";
import { buttonLink, image, text } from "../../../styles/parts";
import { TerminalModelName } from "../../../api";

@Component({
  tag: 'terminal-quantity-selector',
  shadow: false,
})
export class TerminalQuantitySelector {
  @Prop() modelName: TerminalModelName;
  @Prop() imageUrl: string;
  @Prop() description: string;
  @Prop() helpUrl: string;
  @Prop() limit: number = Infinity;

  @State() selectedQuantity: number = 0;

  @Event() selectedQuantityChange: EventEmitter<{ modelName: TerminalModelName, quantity: number }>;

  private removeUnit = () => {
    if (this.selectedQuantity > 0) {
      this.selectedQuantity--;
      this.selectedQuantityChange.emit({ modelName: this.modelName, quantity: this.selectedQuantity });
    }
  }

  private addUnit = () => {
    if (this.limit > 0) {
      this.selectedQuantity++;
      this.selectedQuantityChange.emit({ modelName: this.modelName, quantity: this.selectedQuantity });
    }
  }

  render() {
    return (
      <div class="rounded shadow-sm card p-2" part={text}>
        <div class="d-flex gap-3">
          <div class="d-flex align-items-center">
            <img src={this.imageUrl} alt={this.modelName} height={75} width={75} part={image} />
          </div>

          <div class="d-flex flex-column flex-grow-1 gap-3 p-4 justify-content-center">
            <div class="row">
              <div class="col-6 d-flex gap-2">
                {this.modelName}
                <form-control-tooltip helpText={this.description} />
              </div>
              <div class="col-6 d-flex justify-content-end align-items-center">
                <button class="p-0 minus btn" onClick={this.removeUnit} part={buttonLink}>-</button>
                <div class="w-25 text-center">{this.selectedQuantity}</div>
                <button class="p-0 plus btn" onClick={this.addUnit} part={buttonLink}>+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
