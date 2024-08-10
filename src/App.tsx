import React, { useState, useEffect, useRef, useCallback } from 'react';

interface TimeEntry {
  id: string;
  name: string;
  hourlyWage: number;
  elapsedTime: number;
}

interface Target {
  value: number;
  currency: 'USD' | 'EUR';
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
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [target, setTarget] = useState<Target>({ value: 0, currency: 'USD' });
  const [celebrateTarget, setCelebrateTarget] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const calculateEarnings = useCallback((entry: TimeEntry): number => {
    const hours = entry.elapsedTime / 3600;
    return hours * entry.hourlyWage;
  }, []);

  const calculateTotalEarnings = useCallback((): number => {
    const savedEarnings = savedEntries.reduce(
      (total, entry) => total + calculateEarnings(entry),
      0
    );
    const currentEarnings = calculateEarnings(currentEntry);
    return savedEarnings + currentEarnings;
  }, [savedEntries, currentEntry, calculateEarnings]);

  const calculateCurrentSessionEarnings = useCallback((): number => {
    return calculateEarnings(currentEntry);
  }, [calculateEarnings, currentEntry]);

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

  useEffect(() => {
    const totalEarnings = calculateTotalEarnings();
    const targetInUSD =
      target.currency === 'USD' ? target.value : target.value * 0.9;

    if (totalEarnings >= targetInUSD && targetInUSD > 0) {
      setCelebrateTarget(true);
      if (audioRef.current) {
        audioRef.current.play();
      }
    } else {
      setCelebrateTarget(false);
    }
  }, [calculateTotalEarnings, target]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setShowSaveDialog(true);
  };

  const handleSave = () => {
    if (currentEntry.elapsedTime === 0) {
      setShowSaveDialog(false);
      return;
    }

    const entryToSave = {
      ...currentEntry,
      id: currentEntry.id || Date.now().toString(),
    };

    setSavedEntries((prevEntries) => {
      const existingEntryIndex = prevEntries.findIndex(
        (entry) =>
          entry.name === entryToSave.name &&
          entry.hourlyWage === entryToSave.hourlyWage
      );

      if (existingEntryIndex !== -1) {
        // Merge entries
        const updatedEntries = [...prevEntries];
        updatedEntries[existingEntryIndex] = {
          ...updatedEntries[existingEntryIndex],
          elapsedTime:
            updatedEntries[existingEntryIndex].elapsedTime +
            entryToSave.elapsedTime,
        };
        return updatedEntries;
      } else {
        // Save as new entry
        return [...prevEntries, entryToSave];
      }
    });

    setCurrentEntry({
      id: '',
      name: '',
      hourlyWage: 0,
      elapsedTime: 0,
    });
    setShowSaveDialog(false);
  };

  const handleDiscard = () => {
    setCurrentEntry({
      id: '',
      name: '',
      hourlyWage: 0,
      elapsedTime: 0,
    });
    setShowSaveDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentEntry((prev) => ({
      ...prev,
      [name]: name === 'hourlyWage' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleTargetChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTarget((prev) => ({
      ...prev,
      [name]: name === 'value' ? parseFloat(value) || 0 : value,
    }));
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
      <div>
        <h2>{formatTime(currentEntry.elapsedTime)}</h2>
        <h3>
          Current Session Earnings: $
          {calculateCurrentSessionEarnings().toFixed(2)}
        </h3>
        <h3>
          Total Earnings: ${calculateTotalEarnings().toFixed(2)}
          {celebrateTarget && '🎯🎉'}
        </h3>
        <button onClick={handleStart} disabled={isRunning}>
          Start
        </button>
        <button onClick={handlePause} disabled={!isRunning}>
          Pause
        </button>
        <button onClick={handleStop}>Stop</button>
      </div>
      <div>
        <h3>Set Target</h3>
        <input
          type="number"
          name="value"
          value={target.value}
          onChange={handleTargetChange}
          min="0"
          step="0.01"
        />
        <select
          name="currency"
          value={target.currency}
          onChange={handleTargetChange}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
      </div>
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
      {showSaveDialog && (
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
      )}
      <audio ref={audioRef} src="/music.mp3" />
    </div>
  );
};

export default App;
