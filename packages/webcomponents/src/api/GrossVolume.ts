export interface GrossVolumeReportDate {
  date: string;
  value: number;
}

export interface GrossVolumeReport {
  total: number;
  dates: GrossVolumeReportDate[];
}

export interface GrossVolumeReponseType {
  id: string | null;
  type: string;
  page_info: any;
  data: GrossVolumeReport;
  // error?: any
}
