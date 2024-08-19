import React from 'react';
import { TimeEntry } from '../types';
import { formatTime, calculateEarnings } from '../utils/timeUtils';

interface SavedEntriesProps {
  savedEntries: TimeEntry[];
  calculateTotalEarnings: () => number;
}

const SavedEntries: React.FC<SavedEntriesProps> = ({
  savedEntries,
  calculateTotalEarnings,
}) => {
  return (
    <div>
      <h2>Saved Entries</h2>
      <h3>
        Total Saved: $
        {savedEntries
          .reduce((total, entry) => total + calculateEarnings(entry), 0)
          .toFixed(2)}
      </h3>
      <ul>
        {savedEntries.map((entry) => (
          <li key={entry.id}>
            {entry.name || 'Unnamed'} - {formatTime(entry.elapsedTime)} - $
            {calculateEarnings(entry).toFixed(2)} - $
            {entry.hourlyWage.toFixed(2)}/hour
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedEntries;
