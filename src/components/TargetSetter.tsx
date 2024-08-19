import React from 'react';
import { Target } from '../types';

interface TargetSetterProps {
  target: Target;
  handleTargetChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const TargetSetter: React.FC<TargetSetterProps> = ({
  target,
  handleTargetChange,
}) => {
  return (
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
  );
};

export default TargetSetter;
