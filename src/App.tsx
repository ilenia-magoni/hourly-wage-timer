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
  } = useTimeTracker();

  return (
    <div className="App">
      <h1>Time Tracker</h1>
      {showTimer ? (
        <>
          <div>
            <h4>
              Target:{' '}
              {target.displayValue > 0
                ? `$${target.displayValue.toFixed(2)}`
                : 'No target set'}
            </h4>
            <button onClick={handleEditTarget}>Edit Target</button>
          </div>
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
        </>
      ) : (
        <TargetSetter
          target={target}
          handleTargetChange={handleTargetChange}
          handleSetTarget={handleSetTarget}
          handleSkipTarget={handleSkipTarget}
        />
      )}
      <audio ref={audioRef} src="/music.mp3" />
    </div>
  );
};

export default App;
