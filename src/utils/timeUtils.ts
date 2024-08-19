import { TimeEntry } from '../types';

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const calculateEarnings = (entry: TimeEntry): number => {
  const hours = entry.elapsedTime / 3600;
  return hours * entry.hourlyWage;
};
