export interface ITerminalModel {
  id: string;
  modelName: string;
  description: string;
  imageUrl: string;
  helpUrl: string;
}

export interface ITerminalModelApiResponse {
  id: string;
  model_name: string;
  description: string;
  image_url: string;
  help_url: string;
}

export interface iTerminalModelsApiResponse {
  terminal_models: ITerminalModelApiResponse[];
  order_limit: number;
}

export class TerminalModel implements ITerminalModel {
  public id: string;
  public modelName: string;
  public description: string;
  public imageUrl: string;
  public helpUrl: string;

  constructor(data: ITerminalModelApiResponse) {
    this.id = data.id;
    this.modelName = data.model_name;
    this.description = data.description;
    this.imageUrl = data.image_url;
    this.helpUrl = data.help_url;
  }
}
