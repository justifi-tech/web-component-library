export interface ITerminalModel {
  id: string;
  model_name: string;
  description: string;
  image_url: string;
  help_url: string;
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
  public model_name: string;
  public description: string;
  public image_url: string;
  public help_url: string;

  constructor(data: ITerminalModelApiResponse) {
    this.id = data.id;
    this.model_name = data.model_name;
    this.description = data.description;
    this.image_url = data.image_url;
    this.help_url = data.help_url;
  }
}
