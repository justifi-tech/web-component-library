export class Table {
  public columnKeys: string[];
  private collection: any[];
  private tableColumns: { [key: string]: Function };
  private tableCells: { [key: string]: Function };

  get columnData() {
    return this.columnKeys.map((key) => this.tableColumns[key]());
  }

  get rowData() {
    return this.collection.map((checkout) => {
      return this.columnKeys.map((key) => this.tableCells[key](checkout[key]));
    });
  }

  constructor(
    collection: any[],
    columns: string,
    tableColumns: { [key: string]: Function },
    tableCells: { [key: string]: Function },
  ) {
    this.columnKeys = columns.split(',');
    this.collection = collection;
    this.tableColumns = tableColumns;
    this.tableCells = tableCells;
  }
}
