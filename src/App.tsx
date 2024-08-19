import React from 'react';
import useTimeTracker from './hooks/useTimeTracker';
import TimeEntry from './components/TimeEntry';
import Timer from './components/Timer';
import SaveDialog from './components/SaveDialog';
import SavedEntries from './components/SavedEntries';
import TargetSetter from './components/TargetSetter';

const App: React.FC = () => {
  const {
    currentEntry,
    savedEntries,
    isRunning,
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
  } = useTimeTracker();

  return (
    <div className="App">
      <h1>Time Tracker</h1>
      <TimeEntry
        currentEntry={currentEntry}
        handleInputChange={handleInputChange}
      />
      <Timer
        currentEntry={currentEntry}
        isRunning={isRunning}
        celebrateTarget={celebrateTarget}
        handleStart={handleStart}
        handlePause={handlePause}
        handleStop={handleStop}
        calculateCurrentSessionEarnings={calculateCurrentSessionEarnings}
        calculateTotalEarnings={calculateTotalEarnings}
      />
      <TargetSetter target={target} handleTargetChange={handleTargetChange} />
      <SavedEntries
        savedEntries={savedEntries}
        calculateTotalEarnings={calculateTotalEarnings}
      />
      {showSaveDialog && (
        <SaveDialog
          currentEntry={currentEntry}
          handleInputChange={handleInputChange}
          handleSave={handleSave}
          handleDiscard={handleDiscard}
        />
      )}
      <audio ref={audioRef} src="/music.mp3" />
    </div>
  );
};

export default App;
