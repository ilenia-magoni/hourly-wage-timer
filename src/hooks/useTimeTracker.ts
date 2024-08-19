import { useState, useEffect, useRef, useCallback } from 'react';
import { TimeEntry, Target } from '../types';
import { calculateEarnings } from '../utils/timeUtils';

const useTimeTracker = () => {
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

  const calculateTotalEarnings = useCallback((): number => {
    const savedEarnings = savedEntries.reduce(
      (total, entry) => total + calculateEarnings(entry),
      0
    );
    const currentEarnings = calculateEarnings(currentEntry);
    return savedEarnings + currentEarnings;
  }, [savedEntries, currentEntry]);

  const calculateCurrentSessionEarnings = useCallback((): number => {
    return calculateEarnings(currentEntry);
  }, [currentEntry]);

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

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
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
        const updatedEntries = [...prevEntries];
        updatedEntries[existingEntryIndex] = {
          ...updatedEntries[existingEntryIndex],
          elapsedTime:
            updatedEntries[existingEntryIndex].elapsedTime +
            entryToSave.elapsedTime,
        };
        return updatedEntries;
      } else {
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

  return {
    isRunning,
    currentEntry,
    savedEntries,
    showSaveDialog,
    target,
    celebrateTarget,
    audioRef,
    handleStart,
    handlePause,
    handleStop,
    handleSave,
    handleDiscard,
    handleInputChange,
    handleTargetChange,
    calculateCurrentSessionEarnings,
    calculateTotalEarnings,
  };
};

export default useTimeTracker;
