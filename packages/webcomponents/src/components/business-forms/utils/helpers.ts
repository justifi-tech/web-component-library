import StateOptions from "../../../utils/state-options";

export function getStateAbbreviation(stateName: string): string | undefined {
  const state = StateOptions.find(s => s.label === stateName);
  return state ? state.value : stateName;
}

// filterNumber is intended to be used to format a string that contains a single digit to a two digit string. 
export function filterNumber(num: string): string {
  if (/^\d$/.test(num)) {
    return '0' + num;
  }
  return num;
}

export function constructDate(year: string, month: string, day: string): string {
  return `${year}-${filterNumber(month)}-${filterNumber(day)}`;
}

export function deconstructDate(date: string): { dob_year: string, dob_month: string, dob_day: string } {
  const [dob_year, dob_month, dob_day] = date.split('-');
  return { dob_year, dob_month, dob_day };
}
