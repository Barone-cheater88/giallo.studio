import { PortableText } from '@portabletext/react'
import styles from './PageDescription.module.css'

const typographyVars = {
  subtitle: {
    family: 'var(--font-subtitle)',
    weight: 'var(--font-subtitle-weight)',
    style: 'var(--font-subtitle-style)',
    transform: 'var(--font-subtitle-transform)',
    lineHeight: 'var(--font-subtitle-line-height)',
    fontSize: 'clamp(var(--font-subtitle-size-mobile, 16px), 4vw, var(--font-subtitle-size-desktop, 20px))',
  },
  body: {
    family: 'var(--font-body)',
    weight: 'var(--font-body-weight)',
    style: 'var(--font-body-style)',
    transform: 'var(--font-body-transform)',
    lineHeight: 'var(--font-body-line-height)',
    fontSize: 'clamp(var(--font-body-size-mobile, 14px), 2.5vw, var(--font-body-size-desktop, 16px))',
  }
}

const getParagraphStyle = ({ indent = true, variant = 'subtitle' } = {}) => {
  const typography = typographyVars[variant] || typographyVars.subtitle

  return {
    fontFamily: typography.family,
    fontWeight: typography.weight,
    fontStyle: typography.style,
    textTransform: typography.transform,
    lineHeight: typography.lineHeight,
    fontSize: typography.fontSize,
    color: 'inherit',
    margin: 0,
    marginBottom: '1em',
    textIndent: indent ? '80px' : 0
  }
}

export default function PageDescription({ value, indent = true, variant = 'subtitle' }) {
  if (!Array.isArray(value) || value.length === 0) return null

  return (
    <div className={styles.root}>
      <PortableText
        value={value}
        components={{
          marks: {
            link: ({ children, value }) => {
              const { href, openInNewTab } = value || {}
              if (!href) return <>{children}</>

              return (
                <a
                  href={href}
                  target={openInNewTab ? '_blank' : undefined}
                  rel={openInNewTab ? 'noopener noreferrer' : undefined}
                >
                  {children}
                </a>
              )
            },
            strong: ({ children }) => <strong>{children}</strong>,
            em: ({ children }) => <em>{children}</em>
          },
          block: {
            normal: ({ children }) => <p style={getParagraphStyle({ indent, variant })}>{children}</p>
          }
        }}
      />
    </div>
  )
}
