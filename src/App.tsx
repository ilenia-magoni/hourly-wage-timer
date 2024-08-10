import React, { useState, useEffect } from 'react';

interface TimeEntry {
  id: string;
  name: string;
  hourlyWage: number;
  elapsedTime: number;
}

const App: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<TimeEntry>({
    id: '',
    name: '',
    hourlyWage: 0,
    elapsedTime: 0,
  });
  const [savedEntries, setSavedEntries] = useState<TimeEntry[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingEntry, setPendingEntry] = useState<TimeEntry | null>(null);
  const [showStopDialog, setShowStopDialog] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setCurrentEntry((prev) => ({
          ...prev,
          elapsedTime: prev.elapsedTime + 1,
        }));
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const calculateEarnings = (entry: TimeEntry): string => {
    const hours = entry.elapsedTime / 3600;
    const earnings = hours * entry.hourlyWage;
    return earnings.toFixed(2);
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setShowStopDialog(true);
  };

  const handleSave = () => {
    const entryToSave = {
      ...currentEntry,
      id: currentEntry.id || Date.now().toString(),
    };

    const existingEntryIndex = savedEntries.findIndex(
      (entry) => entry.id === entryToSave.id
    );

    if (existingEntryIndex !== -1) {
      setSavedEntries((prev) => {
        const newEntries = [...prev];
        newEntries[existingEntryIndex] = entryToSave;
        return newEntries;
      });
    } else {
      setSavedEntries((prev) => [...prev, entryToSave]);
    }

    setCurrentEntry({
      id: '',
      name: '',
      hourlyWage: 0,
      elapsedTime: 0,
    });
    setShowStopDialog(false);
  };

  const handleDiscard = () => {
    setCurrentEntry({
      id: '',
      name: '',
      hourlyWage: 0,
      elapsedTime: 0,
    });
    setShowStopDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentEntry((prev) => ({
      ...prev,
      [name]: name === 'hourlyWage' ? parseFloat(value) || 0 : value,
    }));
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const startFromSavedEntry = (entry: TimeEntry) => {
    if (isRunning || currentEntry.elapsedTime > 0) {
      setShowConfirmation(true);
      setPendingEntry(entry);
    } else {
      startNewSession(entry);
    }
  };

  const startNewSession = (entry: TimeEntry) => {
    setCurrentEntry({
      id: Date.now().toString(),
      name: entry.name,
      hourlyWage: entry.hourlyWage,
      elapsedTime: 0,
    });
    setIsRunning(true);
  };

  const handleConfirmation = (action: 'keep' | 'save' | 'discard') => {
    if (action === 'keep') {
      setShowConfirmation(false);
      setPendingEntry(null);
    } else if (action === 'save') {
      handleSave();
      startNewSession(pendingEntry!);
      setShowConfirmation(false);
      setPendingEntry(null);
    } else if (action === 'discard') {
      startNewSession(pendingEntry!);
      setShowConfirmation(false);
      setPendingEntry(null);
    }
  };

  return (
    <div className="App">
      <h1>Time Tracker</h1>
      <div>
        <label htmlFor="name">Entry Name: </label>
        <input
          type="text"
          id="name"
          name="name"
          value={currentEntry.name}
          onChange={handleInputChange}
          disabled={isRunning}
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
          disabled={isRunning}
        />
      </div>
      <div>
        <h2>{formatTime(currentEntry.elapsedTime)}</h2>
        <h3>Earnings: ${calculateEarnings(currentEntry)}</h3>
        <button onClick={handleStart} disabled={isRunning}>
          Start
        </button>
        <button onClick={handlePause} disabled={!isRunning}>
          Pause
        </button>
        <button
          onClick={handleStop}
          disabled={!isRunning && currentEntry.elapsedTime === 0}
        >
          Stop
        </button>
      </div>
      <div>
        <h2>Saved Entries</h2>
        <ul>
          {savedEntries.map((entry) => (
            <li key={entry.id}>
              {entry.name || 'Unnamed'} - {formatTime(entry.elapsedTime)} - $
              {calculateEarnings(entry)} - ${entry.hourlyWage.toFixed(2)}/hour
              <button onClick={() => startFromSavedEntry(entry)}>
                Start New Session
              </button>
            </li>
          ))}
        </ul>
      </div>
      {showConfirmation && (
        <div className="confirmation-dialog">
          <p>You have an active session. What would you like to do?</p>
          <button onClick={() => handleConfirmation('keep')}>
            Keep current session
          </button>
          <button onClick={() => handleConfirmation('save')}>
            Save and start new
          </button>
          <button onClick={() => handleConfirmation('discard')}>
            Discard and start new
          </button>
        </div>
      )}
      {showStopDialog && (
        <div className="stop-dialog">
          <h3>Session Stopped</h3>
          <p>Would you like to save or discard this session?</p>
          <div>
            <label htmlFor="stopName">Entry Name: </label>
            <input
              type="text"
              id="stopName"
              name="name"
              value={currentEntry.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="stopHourlyWage">Hourly Wage (USD): </label>
            <input
              type="number"
              id="stopHourlyWage"
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
      )}
    </div>
  );
};

export default App;
