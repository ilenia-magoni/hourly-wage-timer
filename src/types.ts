export interface TimeEntry {
  id: string;
  name: string;
  hourlyWage: number;
  elapsedTime: number;
}

export interface Target {
  value: number;
  currency: 'USD' | 'EUR';
}
