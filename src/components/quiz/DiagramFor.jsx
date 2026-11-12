import React from 'react';

export default function DiagramFor({ visual, visualData }) {
  if (!visual || visual === 'none') return null;

  if (visual === 'balance') {
    const { p = 3, q = 5, r = 20, isAdd = true } = visualData || {};
    return (
      <div style={{ width: 340, height: 180, background: 'rgba(0,0,0,0.25)', borderRadius: 16, padding: 12 }}>
        <svg viewBox="0 0 340 160" width="100%" height="100%">
          {/* Fulcrum Stand */}
          <polygon points="170,90 150,150 190,150" fill="#78909c" />
          <line x1="130" y1="150" x2="210" y2="150" stroke="#78909c" strokeWidth="6" strokeLinecap="round" />
          {/* Beam */}
          <line x1="40" y1="90" x2="300" y2="90" stroke="#ffd54f" strokeWidth="6" strokeLinecap="round" />
          <circle cx="170" cy="90" r="6" fill="#ff7043" />
          {/* Left Pan */}
          <line x1="60" y1="90" x2="60" y2="125" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
          <ellipse cx="60" cy="125" rx="35" ry="6" fill="#3f51b5" stroke="#ffffff" strokeWidth="1.5" />
          <text x="60" y="118" fill="#00e5ff" fontSize="13" fontWeight="800" textAnchor="middle">
            {p}x {isAdd ? '+' : '−'} {q}
          </text>
          {/* Right Pan */}
          <line x1="280" y1="90" x2="280" y2="125" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
          <ellipse cx="280" cy="125" rx="35" ry="6" fill="#3f51b5" stroke="#ffffff" strokeWidth="1.5" />
          <text x="280" y="118" fill="#ffd54f" fontSize="14" fontWeight="800" textAnchor="middle">
            {r}
          </text>
          {/* Center Equals Sign */}
          <text x="170" y="65" fill="#ffffff" fontSize="20" fontWeight="900" textAnchor="middle">
            =
          </text>
        </svg>
      </div>
    );
  }

  if (visual === 'machine') {
    const { p = 3, q = 5, r = 20, form = 'mul_add' } = visualData || {};
    return (
      <div style={{ width: 340, background: 'rgba(0,0,0,0.3)', borderRadius: 16, padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
          <div style={{ background: 'rgba(0,229,255,0.15)', border: '1px solid #00e5ff', padding: '6px 12px', borderRadius: 8, textAlign: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: '#00e5ff', display: 'block' }}>Input</span>
            <strong style={{ color: '#ffffff', fontSize: '1.1rem' }}>x</strong>
          </div>

          <span style={{ color: '#ffd54f', fontSize: '1.2rem' }}>➔</span>

          <div style={{ background: 'rgba(255,213,79,0.15)', border: '1px solid #ffd54f', padding: '6px 10px', borderRadius: 8, textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: '#ffd54f', display: 'block' }}>Step 1</span>
            <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>× {p}</strong>
          </div>

          <span style={{ color: '#ffd54f', fontSize: '1.2rem' }}>➔</span>

          <div style={{ background: 'rgba(255,213,79,0.15)', border: '1px solid #ffd54f', padding: '6px 10px', borderRadius: 8, textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: '#ffd54f', display: 'block' }}>Step 2</span>
            <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>{form === 'mul_add' ? `+ ${q}` : `− ${q}`}</strong>
          </div>

          <span style={{ color: '#ffd54f', fontSize: '1.2rem' }}>➔</span>

          <div style={{ background: 'rgba(0,230,118,0.15)', border: '1px solid #00e676', padding: '6px 12px', borderRadius: 8, textAlign: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: '#00e676', display: 'block' }}>Output</span>
            <strong style={{ color: '#ffffff', fontSize: '1.1rem' }}>{r}</strong>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 8, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          ⏪ Work backwards from {r}: undo {form === 'mul_add' ? `+ ${q}` : `− ${q}`}, then undo × {p}!
        </div>
      </div>
    );
  }

  if (visual === 'barModel') {
    const { whole = 80, pct = 25, correct = 20 } = visualData || {};
    return (
      <div style={{ width: 340, background: 'rgba(0,0,0,0.3)', borderRadius: 16, padding: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.85rem' }}>
          <span style={{ color: '#00e5ff', fontWeight: 700 }}>Whole: {whole} tokens (100%)</span>
          <span style={{ color: '#ffd54f', fontWeight: 700 }}>Target: {pct}%</span>
        </div>
        <div style={{ width: '100%', height: 32, background: 'rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden', display: 'flex' }}>
          <div
            style={{
              width: `${pct}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #ffd54f, #ff7043)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: 800,
              color: '#000',
            }}
          >
            {pct}%
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
            {100 - pct}%
          </div>
        </div>
      </div>
    );
  }

  if (visual === 'ratioTable') {
    const { rows = [], k } = visualData || {};
    return (
      <div style={{ width: 320, background: 'rgba(0,0,0,0.3)', borderRadius: 16, padding: 14 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
              <th style={{ padding: 6, color: '#00e5ff' }}>x</th>
              {rows.map((r, i) => (
                <th key={i} style={{ padding: 6, color: '#ffffff' }}>{r.x}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: 6, color: '#ffd54f', fontWeight: 700 }}>y</td>
              {rows.map((r, i) => (
                <td key={i} style={{ padding: 6, color: r.y === '?' ? '#00e5ff' : '#ffffff', fontWeight: r.y === '?' ? 800 : 500 }}>
                  {r.y}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        {k && (
          <div style={{ marginTop: 8, textAlign: 'center', fontSize: '0.8rem', color: '#ffd54f' }}>
            Constant of proportionality: y = {k}x
          </div>
        )}
      </div>
    );
  }

  if (visual === 'doubleLine') {
    const { a = 4, b = 20, c = 8, d = 40, unit = 'item' } = visualData || {};
    return (
      <div style={{ width: 340, height: 120, background: 'rgba(0,0,0,0.3)', borderRadius: 16, padding: 12 }}>
        <svg viewBox="0 0 340 100" width="100%" height="100%">
          {/* Top Line (Units) */}
          <line x1="30" y1="35" x2="310" y2="35" stroke="#00e5ff" strokeWidth="3" />
          <circle cx="90" cy="35" r="5" fill="#00e5ff" />
          <text x="90" y="24" fill="#00e5ff" fontSize="12" fontWeight="700" textAnchor="middle">{a} {unit}s</text>
          <circle cx="250" cy="35" r="5" fill="#00e5ff" />
          <text x="250" y="24" fill="#00e5ff" fontSize="12" fontWeight="700" textAnchor="middle">{c} {unit}s</text>

          {/* Bottom Line (Tokens) */}
          <line x1="30" y1="75" x2="310" y2="75" stroke="#ffd54f" strokeWidth="3" />
          <circle cx="90" cy="75" r="5" fill="#ffd54f" />
          <text x="90" y="94" fill="#ffd54f" fontSize="12" fontWeight="700" textAnchor="middle">{b} tokens</text>
          <circle cx="250" cy="75" r="5" fill="#ffd54f" />
          <text x="250" y="94" fill="#ffd54f" fontSize="12" fontWeight="700" textAnchor="middle">? tokens</text>
        </svg>
      </div>
    );
  }

  if (visual === 'methodColumns') {
    const { steps = [], eq } = visualData || {};
    return (
      <div style={{ width: 340, background: 'rgba(0,0,0,0.3)', borderRadius: 16, padding: 14 }}>
        {eq && (
          <div style={{ textAlign: 'center', marginBottom: 8, color: '#00e5ff', fontWeight: 800 }}>
            {eq}
          </div>
        )}
        {steps.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {steps.map((st, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: '0.85rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ color: '#ffd54f', fontWeight: 700 }}>{st.label || `Step ${i + 1}`}:</span>
                <span style={{ color: '#ffffff' }}>{st.text || st}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}
