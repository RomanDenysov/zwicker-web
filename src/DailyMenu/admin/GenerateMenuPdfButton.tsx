'use client'

import { Button, toast } from '@payloadcms/ui'
import React, { useState } from 'react'

type Locale = 'sk' | 'en'

export function GenerateMenuPdfButton() {
  const [loading, setLoading] = useState<Locale | null>(null)
  const [url, setUrl] = useState<string | null>(null)

  const generate = async (locale: Locale) => {
    setLoading(locale)
    try {
      const res = await fetch(`/api/globals/daily-menu/generate-pdf?locale=${locale}`, {
        method: 'POST',
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Generovanie zlyhalo')
      setUrl(data.url)
      toast.success('PDF bolo vygenerované a uložené.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Chyba pri generovaní PDF')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Generovať PDF</div>
      <p style={{ marginBottom: '0.75rem', maxWidth: '40rem', color: 'var(--theme-elevation-600)' }}>
        Vytvorí PDF z aktuálnych kategórií a položiek, uloží ho do médií a nastaví ho do poľa
        „Vygenerované PDF menu“ nižšie.
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <Button
          buttonStyle="secondary"
          size="small"
          disabled={loading !== null}
          onClick={() => generate('sk')}
        >
          {loading === 'sk' ? 'Generujem…' : 'Generovať (SK)'}
        </Button>
        <Button
          buttonStyle="secondary"
          size="small"
          disabled={loading !== null}
          onClick={() => generate('en')}
        >
          {loading === 'en' ? 'Generujem…' : 'Generovať (EN)'}
        </Button>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem' }}>
            Otvoriť posledné PDF
          </a>
        )}
      </div>
    </div>
  )
}
