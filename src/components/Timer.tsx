import React from 'react';
import { TimeEntry } from '../types';
import { formatTime } from '../utils/timeUtils';
import '../styles/TimeTracker.css';

interface TimerProps {
  currentEntry: TimeEntry;
  isRunning: boolean;
  celebrateTarget: boolean;
  handleStart: () => void;
  handlePause: () => void;
  handleStop: () => void;
  calculateCurrentSessionEarnings: () => number;
  calculateTotalEarnings: () => number;
}

const Timer: React.FC<TimerProps> = ({
  currentEntry,
  isRunning,
  celebrateTarget,
  handleStart,
  handlePause,
  handleStop,
  calculateCurrentSessionEarnings,
  calculateTotalEarnings,
}) => {
  return (
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
  );
};

export default Timer;
