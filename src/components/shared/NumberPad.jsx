import React, { useState } from 'react';
import { Delete, Check } from 'lucide-react';
import { playClick } from '../../utils/audio.js';

export default function NumberPad({ onSubmit, unit }) {
  const [val, setVal] = useState('');

  const handleDigit = (d) => {
    playClick();
    if (val.length < 8) {
      setVal((prev) => prev + d);
    }
  };

  const handleDelete = () => {
    playClick();
    setVal((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    playClick();
    setVal('');
  };

  const handleSubmit = () => {
    if (val.trim() === '') return;
    onSubmit(val);
    setVal('');
  };

  return (
    <div className="numberpad-container">
      <div className="numberpad-display">
        {val || '—'} {unit && <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>{unit}</span>}
      </div>

      <div className="numberpad-grid">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button key={digit} className="numpad-key" onClick={() => handleDigit(digit)}>
            {digit}
          </button>
        ))}

        <button className="numpad-key" onClick={handleClear} style={{ fontSize: '1rem' }}>
          C
        </button>
        <button className="numpad-key" onClick={() => handleDigit('0')}>
          0
        </button>
        <button className="numpad-key" onClick={handleDelete} title="Backspace">
          <Delete size={20} style={{ margin: '0 auto' }} />
        </button>

        <button className="numpad-key numpad-key-submit" onClick={handleSubmit}>
          <Check size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
          Submit Answer
        </button>
      </div>
    </div>
  );
}

