export enum TerminalModelName {
  v400 = 'v400',
  p400 = 'p400+',
  e285 = 'e285'
}

export interface ITerminalModel {
  id: string;
  model_name: TerminalModelName;
  description: string;
  image_url: string;
  help_url: string;
}

export interface ITerminalModelApiResponse {
  id: string;
  model_name: TerminalModelName;
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
  public model_name: TerminalModelName;
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
