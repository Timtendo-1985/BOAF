import { useState } from 'react'

export default function SettingsPanel({ apiKey, onSave, onClose }) {
  const [draft, setDraft] = useState(apiKey || '')
  const [showKey, setShowKey] = useState(false)

  const handleSave = () => {
    onSave(draft.trim())
    onClose()
  }

  const handleClear = () => {
    setDraft('')
    onSave('')
    onClose()
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h3 style={styles.title}>AI Settings</h3>
          <button style={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={styles.body}>
          <div style={styles.badge}>✨ Optional — AI-Powered Generation</div>

          <p style={styles.desc}>
            Enter your{' '}
            <strong>Anthropic API key</strong> to enable AI-generated content
            using <strong>Claude</strong>. Claude will write fresh, tailored
            content about family support and addiction recovery for each post.
          </p>

          <p style={styles.desc}>
            Without a key, the app uses our curated library of 50+ pieces of
            high-quality content — which works great!
          </p>

          <div style={styles.inputRow}>
            <input
              type={showKey ? 'text' : 'password'}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="sk-ant-api03-…"
              style={styles.input}
              autoFocus
            />
            <button
              style={styles.eyeBtn}
              onClick={() => setShowKey(!showKey)}
              title={showKey ? 'Hide key' : 'Show key'}
            >
              {showKey ? '🙈' : '👁'}
            </button>
          </div>

          <p style={styles.note}>
            ⚠️ Your key is stored only in your browser's local storage and is
            never sent anywhere except directly to Anthropic's API.
          </p>

          <div style={styles.actions}>
            {apiKey && (
              <button onClick={handleClear} style={styles.clearBtn}>
                Remove Key
              </button>
            )}
            <button onClick={handleSave} style={styles.saveBtn}>
              {draft ? 'Save & Enable AI' : 'Save'}
            </button>
          </div>
        </div>

        <div style={styles.footer}>
          <p style={styles.footerNote}>
            Get an API key at{' '}
            <span style={{ color: '#C4956A' }}>console.anthropic.com</span>
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(61, 77, 80, 0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  panel: {
    background: '#FFFFFF',
    borderRadius: '20px',
    width: '460px',
    maxWidth: '95vw',
    boxShadow: '0 20px 60px rgba(61,77,80,0.25)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.5rem 1.75rem 1rem',
    borderBottom: '1px solid #F0EAE0',
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.3rem',
    color: '#3D4D50',
    fontWeight: '600',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1rem',
    color: '#8A9DA0',
    cursor: 'pointer',
  },
  body: {
    padding: '1.5rem 1.75rem',
  },
  badge: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #C4956A22, #C4956A44)',
    border: '1px solid #C4956A66',
    color: '#9B7248',
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '0.04em',
    padding: '0.3rem 0.75rem',
    borderRadius: '999px',
    marginBottom: '1rem',
    fontFamily: "'Lato', sans-serif",
  },
  desc: {
    fontSize: '0.88rem',
    color: '#5A6D70',
    lineHeight: '1.6',
    marginBottom: '0.8rem',
    fontFamily: "'Lato', sans-serif",
  },
  inputRow: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1rem',
    marginBottom: '0.75rem',
  },
  input: {
    flex: 1,
    border: '2px solid #E8E0D0',
    borderRadius: '10px',
    padding: '0.75rem 1rem',
    fontSize: '0.9rem',
    color: '#3D4D50',
    outline: 'none',
    fontFamily: "'Lato', sans-serif",
    background: '#FAFAF8',
  },
  eyeBtn: {
    background: '#F5F0E8',
    border: '2px solid #E8E0D0',
    borderRadius: '10px',
    padding: '0 0.75rem',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  note: {
    fontSize: '0.75rem',
    color: '#8A9DA0',
    lineHeight: '1.5',
    fontFamily: "'Lato', sans-serif",
    marginBottom: '1.25rem',
    padding: '0.5rem 0.75rem',
    background: '#FFF8F0',
    borderRadius: '8px',
    border: '1px solid #F0E0C8',
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
  },
  clearBtn: {
    background: 'none',
    border: '2px solid #E8E0D0',
    borderRadius: '10px',
    padding: '0.65rem 1.25rem',
    fontSize: '0.85rem',
    color: '#8A9DA0',
    cursor: 'pointer',
    fontFamily: "'Lato', sans-serif",
    fontWeight: '700',
  },
  saveBtn: {
    background: 'linear-gradient(135deg, #C4956A, #9B7248)',
    border: 'none',
    borderRadius: '10px',
    padding: '0.65rem 1.5rem',
    fontSize: '0.85rem',
    color: '#FFFFFF',
    cursor: 'pointer',
    fontFamily: "'Lato', sans-serif",
    fontWeight: '700',
    letterSpacing: '0.04em',
  },
  footer: {
    padding: '0.75rem 1.75rem 1.25rem',
    borderTop: '1px solid #F0EAE0',
  },
  footerNote: {
    fontSize: '0.78rem',
    color: '#8A9DA0',
    textAlign: 'center',
    fontFamily: "'Lato', sans-serif",
  },
}
