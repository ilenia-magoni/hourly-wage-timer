import React from 'react';
import { TimeEntry as TimeEntryType } from '../types';

interface TimeEntryProps {
  currentEntry: TimeEntryType;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TimeEntry: React.FC<TimeEntryProps> = ({
  currentEntry,
  handleInputChange,
}) => {
  return (
    <div>
      <div>
        <label htmlFor="name">Entry Name: </label>
        <input
          type="text"
          id="name"
          name="name"
          value={currentEntry.name}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="hourlyWage">Hourly Wage (USD): </label>
        <input
          type="number"
          id="hourlyWage"
          name="hourlyWage"
          value={currentEntry.hourlyWage}
          onChange={handleInputChange}
          min="0"
          step="0.01"
        />
      </div>
    </div>
  );
};

export default TimeEntry;
