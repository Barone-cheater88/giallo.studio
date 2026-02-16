'use client'

import { useState, useEffect } from 'react'
import styles from './page.module.css'

export default function ClientsGrid({ clients }) {
  const [columnCount, setColumnCount] = useState(4)

  useEffect(() => {
    const updateColumnCount = () => {
      setColumnCount(window.innerWidth <= 890 ? 1 : 4)
    }

    updateColumnCount()
    window.addEventListener('resize', updateColumnCount)
    return () => window.removeEventListener('resize', updateColumnCount)
  }, [])

  return (
    <div className={styles.clientsGrid}>
      {Array.from({ length: columnCount }).map((_, colIndex) => {
        const clientsInColumn = clients.filter((_, index) => index % columnCount === colIndex)
        return (
          <ul
            key={colIndex}
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}
          >
            {clientsInColumn.map((client, clientIndex) => (
              <li
                key={clientIndex}
                className={styles.clientItem}
                style={{
                  margin: 0,
                  padding: 0
                }}
              >
                {client.url ? (
                  <a
                    href={client.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: 'inherit',
                      textDecoration: 'none',
                      display: 'inline'
                    }}
                  >
                    <span>—— </span>
                    <span className="selected-clients-link">{client.name}</span>
                    <span> ↗</span>
                  </a>
                ) : (
                  <span>—— {client.name}</span>
                )}
              </li>
            ))}
          </ul>
        )
      })}
    </div>
  )
}
