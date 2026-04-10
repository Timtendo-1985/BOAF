import { useState } from 'react'
import { getRandomContent, generateWithAI } from '../utils/generateContent.js'
import { typeLabels } from '../data/contentLibrary.js'

const typeIcons = {
  quote: '❝',
  tip: '💡',
  story: '📖',
  inspirational: '✦',
}

export default function ContentGenerator({ postType, apiKey, onReady, onBack }) {
  const [mode, setMode] = useState(null) // 'auto' | 'manual'
  const [content, setContent] = useState('')
  const [attribution, setAttribution] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [lastGenerated, setLastGenerated] = useState(null)

  const handleAutoGenerate = async () => {
    setIsGenerating(true)
    setError('')

    try {
      let result
      if (apiKey) {
        result = await generateWithAI(postType, apiKey)
      } else {
        result = getRandomContent(postType, lastGenerated)
      }

      setContent(result.text)
      setAttribution(result.attribution || '')
      setLastGenerated(result.text)
    } catch (err) {
      setError(`AI generation failed: ${err.message}. Using curated content instead.`)
      const fallback = getRandomContent(postType, lastGenerated)
      setContent(fallback.text)
      setAttribution(fallback.attribution || '')
      setLastGenerated(fallback.text)
    } finally {
      setIsGenerating(false)
    }
  }

  const charLimit = postType === 'story' ? 400 : 280
  const overLimit = content.length > charLimit

  return (
    <div style={styles.container}>
      <button onClick={onBack} style={styles.backBtn}>
        ← Back
      </button>

      <div style={styles.header}>
        <span style={styles.typeIcon}>{typeIcons[postType]}</span>
        <h2 style={styles.heading}>{typeLabels[postType]}</h2>
        <p style={styles.sub}>How would you like to create your content?</p>
      </div>

      {!mode && (
        <div style={styles.modeGrid}>
          <button
            style={styles.modeCard}
            onClick={() => {
              setMode('auto')
              handleAutoGenerate()
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#C4956A'
              e.currentTarget.style.transform = 'translateY(-3px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E8E0D0'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <span style={styles.modeIcon}>✨</span>
            <span style={styles.modeLabel}>Auto-Generate</span>
            <p style={styles.modeDesc}>
              {apiKey
                ? 'Use AI (Claude) to write fresh content tailored to family support & addiction'
                : 'Choose from our curated library of family support content'}
            </p>
            {apiKey && (
              <span style={styles.aiBadge}>✦ AI Powered</span>
            )}
          </button>

          <button
            style={styles.modeCard}
            onClick={() => setMode('manual')}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3D4D50'
              e.currentTarget.style.transform = 'translateY(-3px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E8E0D0'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <span style={styles.modeIcon}>✏️</span>
            <span style={styles.modeLabel}>Write My Own</span>
            <p style={styles.modeDesc}>
              Write your own message in your own words — personal, authentic, and from the heart
            </p>
          </button>
        </div>
      )}

      {mode === 'auto' && (
        <div style={styles.generatedSection}>
          {isGenerating ? (
            <div style={styles.loadingBox}>
              <div style={styles.spinner} />
              <p style={styles.loadingText}>
                {apiKey ? 'Claude is writing your post…' : 'Selecting from the library…'}
              </p>
            </div>
          ) : (
            <>
              {error && <p style={styles.errorText}>{error}</p>}
              {content && (
                <div style={styles.contentPreview}>
                  <p style={styles.generatedText}>"{content}"</p>
                  {attribution && (
                    <p style={styles.generatedAttribution}>{attribution}</p>
                  )}
                </div>
              )}
              <div style={styles.autoActions}>
                <button style={styles.regenerateBtn} onClick={handleAutoGenerate}>
                  ↻ Generate Another
                </button>
                <button
                  style={styles.useThisBtn}
                  onClick={() => onReady(content, attribution)}
                  disabled={!content}
                >
                  Use This →
                </button>
              </div>
              <button onClick={() => setMode(null)} style={styles.switchLink}>
                Switch to Write My Own instead
              </button>
            </>
          )}
        </div>
      )}

      {mode === 'manual' && (
        <div style={styles.manualSection}>
          <div style={styles.textareaWrapper}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={getPlaceholder(postType)}
              style={{
                ...styles.textarea,
                borderColor: overLimit ? '#c0392b' : '#E8E0D0',
              }}
              rows={5}
              autoFocus
            />
            <span
              style={{
                ...styles.charCount,
                color: overLimit ? '#c0392b' : '#8A9DA0',
              }}
            >
              {content.length}/{charLimit}
            </span>
          </div>

          {postType === 'quote' && (
            <input
              type="text"
              value={attribution}
              onChange={(e) => setAttribution(e.target.value)}
              placeholder="Attribution — e.g. — J.K. Rowling  (optional)"
              style={styles.attributionInput}
            />
          )}

          <div style={styles.manualActions}>
            <button onClick={() => setMode(null)} style={styles.cancelBtn}>
              ← Back
            </button>
            <button
              style={{
                ...styles.useThisBtn,
                opacity: !content.trim() || overLimit ? 0.5 : 1,
                cursor: !content.trim() || overLimit ? 'not-allowed' : 'pointer',
              }}
              onClick={() => onReady(content, attribution)}
              disabled={!content.trim() || overLimit}
            >
              Preview Post →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function getPlaceholder(type) {
  const p = {
    quote:
      'Type your quote here… e.g. "Recovery is not a race. You don\'t have to feel guilty if it takes longer than you thought."',
    tip: 'Type your tip here… e.g. "Set boundaries with love. Boundaries are not punishment — they protect both you and your loved one."',
    story:
      'Tell a brief story here… e.g. "A mother once told us she spent years hiding her son\'s addiction. The day she finally asked for help, her healing began."',
    inspirational:
      'Write your inspirational message here… e.g. "Every sunrise is a new chance for healing. For you. For your family. For your loved one."',
  }
  return p[type]
}

const styles = {
  container: {
    maxWidth: '640px',
    margin: '0 auto',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#8A9DA0',
    fontSize: '0.9rem',
    cursor: 'pointer',
    marginBottom: '1.5rem',
    padding: '0',
    fontFamily: "'Lato', sans-serif",
    transition: 'color 0.2s',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  typeIcon: {
    display: 'block',
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
  heading: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.7rem',
    fontWeight: '600',
    color: '#3D4D50',
    marginBottom: '0.4rem',
  },
  sub: {
    fontSize: '0.95rem',
    color: '#8A9DA0',
    fontWeight: '300',
  },
  modeGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.25rem',
  },
  modeCard: {
    background: '#FFFFFF',
    border: '2px solid #E8E0D0',
    borderRadius: '16px',
    padding: '2rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.6rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 16px rgba(61,77,80,0.08)',
    textAlign: 'center',
  },
  modeIcon: {
    fontSize: '2rem',
  },
  modeLabel: {
    fontFamily: "'Lato', sans-serif",
    fontWeight: '700',
    fontSize: '1rem',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: '#3D4D50',
  },
  modeDesc: {
    fontSize: '0.82rem',
    color: '#8A9DA0',
    fontWeight: '300',
    lineHeight: '1.5',
  },
  aiBadge: {
    background: 'linear-gradient(135deg, #C4956A, #7A5C42)',
    color: '#FFFFFF',
    fontSize: '0.7rem',
    padding: '0.2rem 0.7rem',
    borderRadius: '999px',
    fontWeight: '700',
    letterSpacing: '0.05em',
    marginTop: '0.3rem',
  },
  generatedSection: {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(61,77,80,0.1)',
  },
  loadingBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    padding: '2rem',
  },
  spinner: {
    width: '36px',
    height: '36px',
    border: '3px solid #E8E0D0',
    borderTopColor: '#C4956A',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    color: '#8A9DA0',
    fontSize: '0.95rem',
    fontWeight: '300',
  },
  errorText: {
    color: '#c0392b',
    fontSize: '0.85rem',
    marginBottom: '1rem',
    padding: '0.75rem 1rem',
    background: '#fdf2f0',
    borderRadius: '8px',
  },
  contentPreview: {
    background: '#F5F0E8',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    borderLeft: '4px solid #C4956A',
  },
  generatedText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.05rem',
    color: '#3D4D50',
    lineHeight: '1.7',
    fontStyle: 'italic',
  },
  generatedAttribution: {
    fontFamily: "'Lato', sans-serif",
    fontSize: '0.88rem',
    color: '#C4956A',
    marginTop: '0.75rem',
    fontWeight: '400',
  },
  autoActions: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
  },
  regenerateBtn: {
    flex: 1,
    background: 'none',
    border: '2px solid #E8E0D0',
    borderRadius: '10px',
    padding: '0.75rem',
    fontSize: '0.9rem',
    color: '#5A6D70',
    cursor: 'pointer',
    fontFamily: "'Lato', sans-serif",
    fontWeight: '700',
    letterSpacing: '0.02em',
    transition: 'all 0.2s',
  },
  useThisBtn: {
    flex: 1,
    background: 'linear-gradient(135deg, #C4956A, #9B7248)',
    border: 'none',
    borderRadius: '10px',
    padding: '0.75rem',
    fontSize: '0.9rem',
    color: '#FFFFFF',
    cursor: 'pointer',
    fontFamily: "'Lato', sans-serif",
    fontWeight: '700',
    letterSpacing: '0.04em',
    transition: 'opacity 0.2s',
  },
  switchLink: {
    background: 'none',
    border: 'none',
    color: '#8A9DA0',
    fontSize: '0.82rem',
    cursor: 'pointer',
    textDecoration: 'underline',
    display: 'block',
    margin: '0 auto',
    fontFamily: "'Lato', sans-serif",
  },
  manualSection: {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(61,77,80,0.1)',
  },
  textareaWrapper: {
    position: 'relative',
    marginBottom: '1rem',
  },
  textarea: {
    width: '100%',
    border: '2px solid #E8E0D0',
    borderRadius: '10px',
    padding: '1rem',
    fontSize: '1rem',
    color: '#3D4D50',
    lineHeight: '1.6',
    resize: 'vertical',
    outline: 'none',
    transition: 'border-color 0.2s',
    background: '#FAFAF8',
  },
  charCount: {
    position: 'absolute',
    bottom: '0.5rem',
    right: '0.75rem',
    fontSize: '0.75rem',
    fontWeight: '400',
  },
  attributionInput: {
    width: '100%',
    border: '2px solid #E8E0D0',
    borderRadius: '10px',
    padding: '0.75rem 1rem',
    fontSize: '0.9rem',
    color: '#3D4D50',
    outline: 'none',
    marginBottom: '1.5rem',
    background: '#FAFAF8',
  },
  manualActions: {
    display: 'flex',
    gap: '1rem',
  },
  cancelBtn: {
    background: 'none',
    border: '2px solid #E8E0D0',
    borderRadius: '10px',
    padding: '0.75rem 1.25rem',
    fontSize: '0.9rem',
    color: '#5A6D70',
    cursor: 'pointer',
    fontFamily: "'Lato', sans-serif",
    fontWeight: '700',
  },
}
