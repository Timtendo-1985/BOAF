const templates = [
  {
    id: 'cream',
    label: 'Classic Cream',
    preview: {
      background: '#F5F0E8',
      accent: '#C4956A',
      text: '#3D4D50',
    },
  },
  {
    id: 'slate',
    label: 'Deep Slate',
    preview: {
      background: '#3D4D50',
      accent: '#C4956A',
      text: '#F5F0E8',
    },
  },
  {
    id: 'warm',
    label: 'Warm Feather',
    preview: {
      background: 'linear-gradient(135deg, #F5F0E8, #C9A07A)',
      accent: '#7A5C42',
      text: '#3D4D50',
    },
  },
  {
    id: 'white',
    label: 'Nature White',
    preview: {
      background: '#FFFFFF',
      accent: '#C4956A',
      text: '#3D4D50',
      border: '3px solid #C4956A',
      borderSide: 'left',
    },
  },
]

export default function TemplateSelector({ template, onSelect }) {
  return (
    <div style={styles.container}>
      <p style={styles.label}>Choose a template</p>
      <div style={styles.row}>
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            style={styles.swatch}
            title={t.label}
          >
            <div
              style={{
                ...styles.swatchPreview,
                background: t.preview.background,
                ...(t.preview.borderSide === 'left'
                  ? { borderLeft: t.preview.border }
                  : {}),
                outline:
                  template === t.id
                    ? `3px solid ${t.preview.accent}`
                    : '3px solid transparent',
                outlineOffset: '2px',
              }}
            >
              {/* Mini content lines */}
              <div
                style={{
                  width: '60%',
                  height: '3px',
                  background: t.preview.accent,
                  borderRadius: '2px',
                  marginBottom: '5px',
                }}
              />
              <div
                style={{
                  width: '80%',
                  height: '2px',
                  background: t.preview.text,
                  borderRadius: '2px',
                  opacity: 0.4,
                  marginBottom: '3px',
                }}
              />
              <div
                style={{
                  width: '70%',
                  height: '2px',
                  background: t.preview.text,
                  borderRadius: '2px',
                  opacity: 0.4,
                }}
              />
            </div>
            <span
              style={{
                ...styles.swatchLabel,
                color: template === t.id ? '#3D4D50' : '#8A9DA0',
                fontWeight: template === t.id ? '700' : '400',
              }}
            >
              {t.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: {
    marginBottom: '1.5rem',
  },
  label: {
    fontFamily: "'Lato', sans-serif",
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#8A9DA0',
    marginBottom: '0.75rem',
    textAlign: 'center',
  },
  row: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  swatch: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0',
  },
  swatchPreview: {
    width: '72px',
    height: '72px',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(61,77,80,0.12)',
    transition: 'outline 0.15s',
  },
  swatchLabel: {
    fontFamily: "'Lato', sans-serif",
    fontSize: '0.7rem',
    letterSpacing: '0.02em',
    transition: 'all 0.15s',
  },
}
