import React from 'react';
import { Target } from '../types';

interface TargetSetterProps {
  target: Target;
  handleTargetChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSetTarget: () => void;
  handleSkipTarget: () => void;
}

const TargetSetter: React.FC<TargetSetterProps> = ({
  target,
  handleTargetChange,
  handleSetTarget,
  handleSkipTarget,
}) => {
  return (
    <div>
      <h2>Set Your Earnings Target</h2>
      <p>
        Set a target to achieve or skip to start tracking time without a target.
      </p>
      <input
        type="number"
        name="originalValue"
        value={target.originalValue}
        onChange={handleTargetChange}
        min="0"
        step="0.01"
      />
      <select
        name="currency"
        value={target.currency}
        onChange={handleTargetChange}
      >
        <option value="EUR">EUR</option>
        <option value="USD">USD</option>
      </select>
      <div>
        <button onClick={handleSetTarget}>Set Target</button>
        <button onClick={handleSkipTarget}>Skip Target</button>
      </div>
    </div>
  );
};

export default TargetSetter;
