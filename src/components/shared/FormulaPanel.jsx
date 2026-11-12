import React from 'react';
import { X, BookOpen, ExternalLink } from 'lucide-react';
import { METHOD_CARDS } from '../../data/methodCards.js';

export default function FormulaPanel({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="method-drawer-backdrop" onClick={onClose}>
      <div className="method-drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="method-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BookOpen size={22} color="#ffd54f" />
            <h2 className="method-drawer-title">Method Masters Reference</h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            <X size={24} />
          </button>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.4 }}>
          Compare the core mathematical methods used across global Grade 7 problem solving. Remember: every road can reach the destination, but choosing the right tool saves time and errors!
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {METHOD_CARDS.map((card) => (
            <div key={card.id} className="method-card-entry">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '1.2rem' }}>{card.icon}</span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: '#00e5ff',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                  }}
                >
                  {card.tag}
                </span>
              </div>
              <h4 style={{ fontFamily: 'var(--font-display)', color: '#ffffff', fontSize: '1.1rem' }}>
                {card.title}
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.4 }}>
                {card.summary}
              </p>
              <div
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  padding: '8px 12px',
                  borderRadius: 8,
                  fontSize: '0.85rem',
                  color: '#ffd54f',
                  fontFamily: 'monospace',
                }}
              >
                {card.example}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                💡 <strong>Best when:</strong> {card.bestWhen}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

