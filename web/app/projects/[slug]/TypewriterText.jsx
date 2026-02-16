'use client'

import styles from './project.module.css'

export default function TypewriterText({ text }) {
  // Dividi il testo in paragrafi (separati da \n)
  const paragraphs = text ? text.split('\n').filter(p => p.trim()) : []
  
  return (
    <div className={styles.description} data-description>
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  )
}

