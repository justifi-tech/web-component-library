export class Table<T> {
  public columnKeys: string[];
  private collection: T[];
  private tableColumns: { [key: string]: Function };
  private tableCells: { [key: string]: Function };

  get columnData() {
    return this.columnKeys.map((key) => this.tableColumns[key]());
  }

  get rowData() {
    return this.collection.map((dataEntry, index) => {
      return this.columnKeys.map((key) =>
        this.tableCells[key](dataEntry, index)
      );
    });
  }

  set collectionData(collection: T[]) {
    this.collection = collection;
  }

  constructor(
    collection: T[],
    columns: string,
    tableColumns: { [key: string]: Function },
    tableCells: { [key: string]: Function }
  ) {
    this.columnKeys = columns.split(',');
    this.collection = collection;
    this.tableColumns = tableColumns;
    this.tableCells = tableCells;
  }
}
