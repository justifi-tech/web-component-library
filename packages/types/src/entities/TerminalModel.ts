export enum TerminalModelName {
  v400 = 'v400',
  p400 = 'p400+',
  e285 = 'e285',
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

export interface ITerminalModelsApiResponse {
  terminal_models: ITerminalModelApiResponse[];
  order_limit: number;
}
