import React, { useState } from 'react';
import { TimeEntry } from '../types';
import { formatTime } from '../utils/timeUtils';
import '../styles/TimeTracker.css';

interface EditableEntryProps {
  entry: TimeEntry;
  onSave: (updatedEntry: TimeEntry) => void;
  onCancel: () => void; // New prop for canceling edit
}

const EditableEntry: React.FC<EditableEntryProps> = ({
  entry,
  onSave,
  onCancel,
}) => {
  const [editedEntry, setEditedEntry] = useState(entry);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedEntry((prev) => ({
      ...prev,
      [name]:
        name === 'elapsedTime'
          ? parseInt(value)
          : name === 'hourlyWage'
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...editedEntry, isEditing: false });
  };

  // Helper function to convert seconds to hours and minutes
  const secondsToHoursMinutes = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return { hours, minutes };
  };

  const { hours, minutes } = secondsToHoursMinutes(editedEntry.elapsedTime);

  // Update to handle hours and minutes
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = parseInt(value) || 0;
    const newSeconds =
      name === 'hours'
        ? newValue * 3600 + minutes * 60
        : hours * 3600 + newValue * 60;
    setEditedEntry((prev) => ({
      ...prev,
      elapsedTime: newSeconds,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="editable-entry-form">
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={editedEntry.name}
          onChange={handleChange}
        />
      </label>
      <label>
        Hourly Wage ($):
        <input
          type="number"
          name="hourlyWage"
          value={editedEntry.hourlyWage}
          onChange={handleChange}
          min="0"
          step="0.01"
        />
      </label>
      <label>
        Duration:
        <div className="duration-input">
          <input
            type="number"
            name="hours"
            value={hours}
            onChange={handleDurationChange}
            min="0"
          />{' '}
          hrs
          <input
            type="number"
            name="minutes"
            value={minutes}
            onChange={handleDurationChange}
            min="0"
            max="59"
          />{' '}
          mins
          <span className="current-time">
            (Current: {formatTime(editedEntry.elapsedTime)})
          </span>
        </div>
      </label>
      <div>
        <button type="submit">Save Changes</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditableEntry;
