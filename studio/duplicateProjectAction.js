import React, {useMemo, useState} from 'react'
import {useClient} from 'sanity'
import {useToast} from '@sanity/ui'

/**
 * Document Action: duplica un progetto creando una nuova bozza.
 * - Copia tutti i campi
 * - Resetta slug (così non collide)
 * - Appende "(copy)" al titolo
 */
export function duplicateProjectAction(props) {
  const {id, type, draft, published} = props
  const client = useClient({apiVersion: '2024-01-01'})
  const toast = useToast()
  const [isDuplicating, setIsDuplicating] = useState(false)

  const sourceDoc = useMemo(() => draft || published, [draft, published])

  return useMemo(() => {
    if (type !== 'projects') return null
    if (!sourceDoc) return null

    return {
      label: isDuplicating ? 'Duplicazione…' : 'Duplica progetto',
      tone: 'primary',
      disabled: isDuplicating,
      onHandle: async () => {
        try {
          setIsDuplicating(true)

          const newId = typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : String(Date.now())
          const newDraftId = `drafts.${newId}`

          // Copia pulita (senza meta-campi Sanity)
          // Nota: manteniamo immagini/file/reference così come sono.
          const {
            _id: _ignoreId,
            _rev,
            _createdAt,
            _updatedAt,
            ...rest
          } = sourceDoc

          const nextTitle = rest?.title ? `${rest.title} (copy)` : 'Untitled (copy)'

          await client.create({
            ...rest,
            _id: newDraftId,
            _type: 'projects',
            title: nextTitle,
            slug: undefined
          })

          toast.push({
            status: 'success',
            title: 'Progetto duplicato',
            description: 'Ho creato una nuova bozza. Imposta uno slug nuovo prima di pubblicare.'
          })
        } catch (err) {
          toast.push({
            status: 'error',
            title: 'Errore duplicazione',
            description: err?.message || String(err)
          })
        } finally {
          setIsDuplicating(false)
          props.onComplete()
        }
      }
    }
  }, [client, isDuplicating, props, sourceDoc, toast, type])
}


