import React from 'react';
import { TimeEntry } from '../types';
import { formatTime, calculateEarnings } from '../utils/timeUtils';
import EditableEntry from './EditableEntry';
import '../styles/TimeTracker.css';

interface SavedEntriesProps {
  savedEntries: TimeEntry[];
  calculateTotalEarnings: () => number;
  updateEntry: (updatedEntry: TimeEntry) => void;
}

const SavedEntries: React.FC<SavedEntriesProps> = ({
  savedEntries,
  calculateTotalEarnings,
  updateEntry,
}) => {
  const toggleEdit = (entry: TimeEntry) => {
    updateEntry({ ...entry, isEditing: !entry.isEditing });
  };

  return (
    <div className="saved-entries">
      <h2>Saved Entries</h2>
      <h3>Total Saved: ${calculateTotalEarnings().toFixed(2)}</h3>
      <ul>
        {savedEntries.map((entry) => (
          <li key={entry.id}>
            {entry.isEditing ? (
              <EditableEntry
                entry={entry}
                onSave={updateEntry}
                onCancel={() => toggleEdit(entry)}
              />
            ) : (
              <>
                <strong>{entry.name || 'Unnamed'}</strong> -{' '}
                {formatTime(entry.elapsedTime)} - $
                {calculateEarnings(entry).toFixed(2)} - $
                {entry.hourlyWage.toFixed(2)}/hour
                <button onClick={() => toggleEdit(entry)}>✏️ Edit</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedEntries;
