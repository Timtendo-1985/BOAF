import { useState, useRef } from 'react'
import PostTypeSelector from './components/PostTypeSelector.jsx'
import ContentGenerator from './components/ContentGenerator.jsx'
import PostCanvas from './components/PostCanvas.jsx'
import TemplateSelector from './components/TemplateSelector.jsx'
import SettingsPanel from './components/SettingsPanel.jsx'
import { downloadPost } from './utils/downloadPost.js'
import './App.css'

const STEPS = ['Choose Type', 'Create Content', 'Preview & Download']

export default function App() {
  const [step, setStep] = useState(1)
  const [postType, setPostType] = useState(null)
  const [content, setContent] = useState('')
  const [attribution, setAttribution] = useState('')
  const [template, setTemplate] = useState('cream')
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadedName, setDownloadedName] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem('boaf_anthropic_key') || ''
  )
  const canvasRef = useRef(null)

  const handleTypeSelect = (type) => {
    setPostType(type)
    setContent('')
    setAttribution('')
    setStep(2)
  }

  const handleContentReady = (text, attr = '') => {
    setContent(text)
    setAttribution(attr)
    setStep(3)
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
    } else if (step === 3) {
      setStep(2)
    }
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    setDownloadedName('')
    try {
      const name = await downloadPost(postType)
      setDownloadedName(name)
      setTimeout(() => setDownloadedName(''), 4000)
    } catch (err) {
      alert(`Download failed: ${err.message}`)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleSaveApiKey = (key) => {
    setApiKey(key)
    if (key) {
      localStorage.setItem('boaf_anthropic_key', key)
    } else {
      localStorage.removeItem('boaf_anthropic_key')
    }
  }

  const handleStartOver = () => {
    setStep(1)
    setPostType(null)
    setContent('')
    setAttribution('')
  }

  return (
    <div className="app-wrapper">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-logo">
            <img src="/logo.png" alt="Birds of a Feather Family Support Services" />
          </div>
          <div className="header-titles">
            <h1>Instagram Post Generator</h1>
            <p>birds of a feather family support services</p>
          </div>
          <button
            className="settings-btn"
            onClick={() => setShowSettings(true)}
            title="AI Settings"
          >
            <span className="settings-icon">⚙</span>
            {apiKey ? (
              <span className="ai-active-dot" title="AI enabled" />
            ) : null}
          </button>
        </div>
      </header>

      {/* ── Step Indicator ── */}
      <div className="step-bar">
        {STEPS.map((label, i) => {
          const num = i + 1
          const isActive = step === num
          const isDone = step > num
          return (
            <div key={label} className="step-item">
              <div
                className={`step-circle ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                onClick={() => isDone && setStep(num)}
                style={{ cursor: isDone ? 'pointer' : 'default' }}
              >
                {isDone ? '✓' : num}
              </div>
              <span
                className={`step-label ${isActive ? 'active' : ''}`}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`step-line ${isDone ? 'done' : ''}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* ── Main Content ── */}
      <main className="app-main">
        {/* STEP 1 */}
        {step === 1 && (
          <section className="step-section">
            <PostTypeSelector onSelect={handleTypeSelect} />
          </section>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <section className="step-section">
            <ContentGenerator
              postType={postType}
              apiKey={apiKey}
              onReady={handleContentReady}
              onBack={handleBack}
            />
          </section>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <section className="step-section preview-step">
            {/* Left: Controls */}
            <div className="preview-controls">
              <button onClick={handleBack} className="back-link">
                ← Edit Content
              </button>

              <TemplateSelector template={template} onSelect={setTemplate} />

              <div className="post-type-chip">
                <span className="chip-label">Post type</span>
                <span className="chip-value">
                  {postType?.replace('_', ' ')}
                </span>
              </div>

              <div className="content-preview-box">
                <p className="content-text-preview">{content}</p>
                {attribution && (
                  <p className="attribution-preview">{attribution}</p>
                )}
              </div>

              <div className="action-buttons">
                <button
                  onClick={handleDownload}
                  className="download-btn"
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <span className="btn-spinner" /> Preparing…
                    </>
                  ) : (
                    '⬇ Download 1080×1080 PNG'
                  )}
                </button>

                {downloadedName && (
                  <p className="download-success">
                    ✓ Saved as <em>{downloadedName}</em>
                  </p>
                )}

                <button onClick={handleStartOver} className="start-over-btn">
                  ✦ Create Another Post
                </button>
              </div>

              <div className="website-note">
                <span>🌐</span>
                <a
                  href="https://birdsofafeatherfamily.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  birdsofafeatherfamily.com
                </a>
              </div>
            </div>

            {/* Right: Canvas */}
            <div className="canvas-wrapper">
              <div className="canvas-label">Instagram Preview</div>
              <div className="canvas-outer">
                <PostCanvas
                  ref={canvasRef}
                  postType={postType}
                  content={content}
                  attribution={attribution}
                  template={template}
                />
              </div>
              <p className="canvas-hint">
                Downloads at full 1080 × 1080 px resolution
              </p>
            </div>
          </section>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="app-footer">
        <p>
          Birds of a Feather Family Support Services &nbsp;·&nbsp;{' '}
          <span>birdsofafeatherfamily.com</span>
        </p>
      </footer>

      {/* ── Settings Panel ── */}
      {showSettings && (
        <SettingsPanel
          apiKey={apiKey}
          onSave={handleSaveApiKey}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
