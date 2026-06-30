import React from 'react'

/**
 * Re-mounts on every front-end navigation, so the CSS `page-enter` animation
 * (see globals.css) replays each time a new route's content streams in. Header
 * and Footer live in layout.tsx, outside this wrapper, so they stay put.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-transition">{children}</div>
}
