export interface TimeEntry {
  id: string;
  name: string;
  hourlyWage: number;
  elapsedTime: number;
  isEditing?: boolean; // New property
}

export interface Target {
  originalValue: number;
  displayValue: number; // Value to display in USD
  comparisonValue: number; // Value to compare with total earnings
  currency: 'USD' | 'EUR';
}
