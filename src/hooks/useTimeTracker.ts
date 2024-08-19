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
  const [target, setTarget] = useState<Target>({
    originalValue: 0,
    displayValue: 0,
    comparisonValue: 0,
    currency: 'EUR',
  });
  const [celebrateTarget, setCelebrateTarget] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // This function returns the amount to display in USD
  const calculateDisplayTarget = (targetState: Target): number => {
    return targetState.currency === 'USD'
      ? targetState.originalValue / 0.7
      : targetState.originalValue / 0.8 / 0.7; // Convert EUR to USD and then divide by 0.7
  };

  // This function returns the amount to compare with the total earnings
  const calculateComparisonTarget = (targetState: Target): number => {
    return targetState.currency === 'USD'
      ? targetState.originalValue / 0.7
      : targetState.originalValue; // Keep original EUR value for comparison
  };
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

    if (totalEarnings >= target.comparisonValue && target.comparisonValue > 0) {
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
    setTarget((prev) => {
      const updatedTarget: Target = {
        ...prev,
        [name]: name === 'originalValue' ? parseFloat(value) || 0 : value,
      };
      const displayValue = calculateDisplayTarget(updatedTarget);
      const comparisonValue = calculateComparisonTarget(updatedTarget);
      return {
        ...updatedTarget,
        displayValue,
        comparisonValue,
      };
    });
  };

  const handleSetTarget = () => {
    setShowTimer(true);
  };

  const handleSkipTarget = () => {
    setTarget({
      originalValue: 0,
      displayValue: 0,
      comparisonValue: 0,
      currency: 'USD',
    });
    setShowTimer(true);
  };

  const handleEditTarget = () => {
    setShowTimer(false);
  };

  const updateEntry = (updatedEntry: TimeEntry) => {
    setSavedEntries((entries) =>
      entries.map((e) => (e.id === updatedEntry.id ? updatedEntry : e))
    );
  };

  return {
    isRunning,
    currentEntry,
    savedEntries,
    showSaveDialog,
    target,
    celebrateTarget,
    audioRef,
    showTimer,
    handleStart,
    handlePause,
    handleStop,
    handleSave,
    handleDiscard,
    handleInputChange,
    handleTargetChange,
    handleSetTarget,
    handleSkipTarget,
    handleEditTarget,
    calculateCurrentSessionEarnings,
    calculateTotalEarnings,
    updateEntry,
  };
};

export default useTimeTracker;
