const types = [
  {
    id: 'quote',
    label: 'Quote',
    icon: '❝',
    description: 'A meaningful quote about recovery & family healing',
    color: '#C4956A',
  },
  {
    id: 'tip',
    label: 'Family Tip',
    icon: '💡',
    description: 'A practical tip for families supporting a loved one',
    color: '#3D4D50',
  },
  {
    id: 'story',
    label: 'Story',
    icon: '📖',
    description: 'A brief, hopeful story about the family journey',
    color: '#7A5C42',
  },
  {
    id: 'inspirational',
    label: 'Inspirational',
    icon: '✦',
    description: 'An uplifting message to carry families through',
    color: '#5A6D70',
  },
]

export default function PostTypeSelector({ onSelect }) {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>What type of post would you like?</h2>
      <p style={styles.sub}>
        Choose the kind of content you want to share with your community.
      </p>
      <div style={styles.grid}>
        {types.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            style={styles.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = `0 12px 36px rgba(61,77,80,0.18)`
              e.currentTarget.style.borderColor = type.color
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = `0 4px 16px rgba(61,77,80,0.08)`
              e.currentTarget.style.borderColor = '#E8E0D0'
            }}
          >
            <span style={{ ...styles.icon, color: type.color }}>
              {type.icon}
            </span>
            <span style={{ ...styles.label, color: type.color }}>
              {type.label}
            </span>
            <p style={styles.description}>{type.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: {
    textAlign: 'center',
  },
  heading: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.8rem',
    fontWeight: '600',
    color: '#3D4D50',
    marginBottom: '0.5rem',
  },
  sub: {
    fontSize: '1rem',
    color: '#8A9DA0',
    marginBottom: '2.5rem',
    fontWeight: '300',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.25rem',
    maxWidth: '620px',
    margin: '0 auto',
  },
  card: {
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
  },
  icon: {
    fontSize: '2.2rem',
    lineHeight: 1,
  },
  label: {
    fontFamily: "'Lato', sans-serif",
    fontWeight: '700',
    fontSize: '1.05rem',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  description: {
    fontFamily: "'Lato', sans-serif",
    fontSize: '0.82rem',
    color: '#8A9DA0',
    fontWeight: '300',
    lineHeight: '1.5',
    textAlign: 'center',
  },
}
