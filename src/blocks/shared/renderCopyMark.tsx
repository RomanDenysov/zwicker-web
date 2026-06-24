import React from 'react'

/**
 * Splits a string on the `©` character and wraps each occurrence in
 * `<span className="copy-mark">©</span>`. The mark inherits the surrounding
 * text color (see `.copy-mark` in globals.css).
 */
export function renderCopyMark(text: string): React.ReactNode {
  const parts = text.split('©')
  if (parts.length === 1) return text
  return parts.map((part, i) => (
    <React.Fragment key={i}>
      {part}
      {i < parts.length - 1 && <span className="copy-mark">©</span>}
    </React.Fragment>
  ))
}
