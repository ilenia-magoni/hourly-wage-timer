import React from 'react';
import { TimeEntry } from '../types';

interface SaveDialogProps {
  currentEntry: TimeEntry;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  handleDiscard: () => void;
}

const SaveDialog: React.FC<SaveDialogProps> = ({
  currentEntry,
  handleInputChange,
  handleSave,
  handleDiscard,
}) => {
  return (
    <div className="save-dialog">
      <h3>Save or Discard Session</h3>
      <div>
        <label htmlFor="saveName">Entry Name: </label>
        <input
          type="text"
          id="saveName"
          name="name"
          value={currentEntry.name}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="saveHourlyWage">Hourly Wage (USD): </label>
        <input
          type="number"
          id="saveHourlyWage"
          name="hourlyWage"
          value={currentEntry.hourlyWage}
          onChange={handleInputChange}
          min="0"
          step="0.01"
        />
      </div>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleDiscard}>Discard</button>
    </div>
  );
};

export default SaveDialog;
