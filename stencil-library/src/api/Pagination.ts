export interface IPagination {
  has_previous: boolean,
  has_next: boolean,
  start_cursor: string,
  end_cursor: string
}

export class Pagination implements IPagination {
  public has_previous: boolean;
  public has_next: boolean;
  public start_cursor: string;
  public end_cursor: string;

  constructor(pagination?: IPagination) {
    this.has_previous = pagination?.has_previous || false;
    this.has_next = pagination?.has_next || false;
    this.start_cursor = pagination?.start_cursor || '';
    this.end_cursor = pagination?.end_cursor || '';
  }
}
