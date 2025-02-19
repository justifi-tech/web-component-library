export interface iTerminalModel {
  id: string;
  modelName: string;
  description: string;
  imageUrl: string;
  helpUrl: string;
}

export interface iTerminalModelApiResponse {
  id: string;
  model_name: string;
  description: string;
  image_url: string;
  help_url: string;
}

export interface iTerminalModelsApiResponse {
  terminal_models: iTerminalModelApiResponse[];
  order_limit: number;
}

export class TerminalModel implements iTerminalModel {
  public id: string;
  public modelName: string;
  public description: string;
  public imageUrl: string;
  public helpUrl: string;

  constructor(data: iTerminalModelApiResponse) {
    this.id = data.id;
    this.modelName = data.model_name;
    this.description = data.description;
    this.imageUrl = data.image_url;
    this.helpUrl = data.help_url;
  }
}
