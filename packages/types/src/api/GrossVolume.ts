export interface GrossVolumeReportDate {
  date: string;
  value: number;
}

export interface GrossVolumeReport {
  total: number;
  dates: GrossVolumeReportDate[];
}
