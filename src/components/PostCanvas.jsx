import { forwardRef } from 'react'
import { typeLabels } from '../data/contentLibrary.js'

const TEMPLATES = {
  cream: {
    background: '#F5F0E8',
    textColor: '#3D4D50',
    accentColor: '#C4956A',
    labelColor: '#C4956A',
    footerColor: '#8A9DA0',
    dividerColor: '#C4956A',
    logoFilter: 'none',
    logoPosition: 'top',
    quoteMark: '#D4B08C',
    border: 'none',
  },
  slate: {
    background: '#3D4D50',
    textColor: '#F5F0E8',
    accentColor: '#C4956A',
    labelColor: '#C4956A',
    footerColor: '#8A9DA0',
    dividerColor: '#C4956A',
    logoFilter: 'brightness(0) invert(1)',
    logoPosition: 'bottom',
    quoteMark: '#5A6D70',
    border: 'none',
  },
  warm: {
    background: 'linear-gradient(160deg, #F5F0E8 0%, #E8D5B8 55%, #C9A07A 100%)',
    textColor: '#3D4D50',
    accentColor: '#7A5C42',
    labelColor: '#7A5C42',
    footerColor: '#9B7248',
    dividerColor: '#9B7248',
    logoFilter: 'none',
    logoPosition: 'top',
    quoteMark: '#C9A07A',
    border: 'none',
  },
  white: {
    background: '#FFFFFF',
    textColor: '#3D4D50',
    accentColor: '#C4956A',
    labelColor: '#C4956A',
    footerColor: '#8A9DA0',
    dividerColor: '#C4956A',
    logoFilter: 'none',
    logoPosition: 'top',
    quoteMark: '#E8D5B8',
    border: '10px solid #C4956A',
    borderSide: 'left',
  },
}

const PostCanvas = forwardRef(function PostCanvas(
  { postType, content, attribution, template = 'cream' },
  ref
) {
  const t = TEMPLATES[template] || TEMPLATES.cream
  const label = typeLabels[postType] || postType?.toUpperCase()
  const isSlate = template === 'slate'
  const hasTopLogo = t.logoPosition === 'top'

  const canvasStyle = {
    width: '540px',
    height: '540px',
    background: t.background,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '36px 40px 28px',
    overflow: 'hidden',
    ...(t.border && t.borderSide === 'left'
      ? { borderLeft: t.border }
      : {}),
  }

  const logoStyle = {
    width: hasTopLogo ? '160px' : '110px',
    height: 'auto',
    objectFit: 'contain',
    filter: t.logoFilter,
    display: 'block',
  }

  return (
    <div id="post-canvas" ref={ref} style={canvasStyle}>
      {/* Decorative corner dots for warm template */}
      {template === 'warm' && (
        <>
          <div style={cornerDots('top-left', t.dividerColor)} />
          <div style={cornerDots('bottom-right', t.dividerColor)} />
        </>
      )}

      {/* Top section */}
      <div style={styles.topSection}>
        {hasTopLogo && (
          <img
            src="/logo.png"
            alt="Birds of a Feather Family Support Services"
            style={logoStyle}
            crossOrigin="anonymous"
          />
        )}
        {hasTopLogo && (
          <div
            style={{
              width: '120px',
              height: '1.5px',
              background: t.dividerColor,
              margin: '14px auto 0',
              opacity: 0.7,
            }}
          />
        )}
      </div>

      {/* Content section */}
      <div style={styles.contentSection}>
        {/* Type label */}
        <div style={styles.labelRow}>
          <span
            style={{
              ...styles.typeLabel,
              color: t.labelColor,
            }}
          >
            {label}
          </span>
        </div>

        {/* Quote marks for quote type */}
        {postType === 'quote' && (
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '5rem',
              color: t.quoteMark,
              lineHeight: '0.5',
              marginBottom: '8px',
              textAlign: 'center',
              userSelect: 'none',
            }}
          >
            "
          </div>
        )}

        {/* Main content */}
        <p
          style={{
            ...styles.contentText,
            color: t.textColor,
            fontSize: getContentFontSize(content),
          }}
        >
          {content}
        </p>

        {/* Attribution */}
        {attribution && (
          <p
            style={{
              ...styles.attribution,
              color: t.accentColor,
            }}
          >
            {attribution}
          </p>
        )}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <div
          style={{
            width: '80px',
            height: '1.5px',
            background: t.dividerColor,
            margin: '0 auto 12px',
            opacity: 0.7,
          }}
        />

        {/* Slate template: logo in footer */}
        {isSlate && (
          <img
            src="/logo.png"
            alt="Birds of a Feather"
            style={{ ...logoStyle, marginBottom: '10px' }}
            crossOrigin="anonymous"
          />
        )}

        <p
          style={{
            ...styles.website,
            color: t.footerColor,
          }}
        >
          birdsofafeatherfamily.com
        </p>
      </div>
    </div>
  )
})

function getContentFontSize(text = '') {
  const len = text.length
  if (len < 80) return '1.25rem'
  if (len < 150) return '1.1rem'
  if (len < 250) return '0.98rem'
  return '0.88rem'
}

function cornerDots(position, color) {
  const isTop = position.includes('top')
  const isLeft = position.includes('left')
  return {
    position: 'absolute',
    [isTop ? 'top' : 'bottom']: '18px',
    [isLeft ? 'left' : 'right']: '18px',
    display: 'flex',
    gap: '5px',
    flexDirection: isLeft ? 'row' : 'row-reverse',
  }
}

const styles = {
  topSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  contentSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    padding: '0 8px',
  },
  labelRow: {
    marginBottom: '12px',
  },
  typeLabel: {
    fontFamily: "'Lato', sans-serif",
    fontWeight: '700',
    fontSize: '0.65rem',
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
  },
  contentText: {
    fontFamily: "'Playfair Display', serif",
    fontWeight: '400',
    lineHeight: '1.65',
    textAlign: 'center',
    fontStyle: 'italic',
    padding: '0 4px',
  },
  attribution: {
    fontFamily: "'Lato', sans-serif",
    fontWeight: '400',
    fontSize: '0.78rem',
    marginTop: '14px',
    letterSpacing: '0.03em',
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  website: {
    fontFamily: "'Lato', sans-serif",
    fontWeight: '300',
    fontSize: '0.65rem',
    letterSpacing: '0.14em',
    textTransform: 'lowercase',
  },
}

export default PostCanvas
