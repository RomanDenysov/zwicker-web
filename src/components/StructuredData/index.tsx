import React from 'react'

// Escape `<` so a CMS field value containing `</script>` can't break out of the tag.
const serialize = (block: object) => JSON.stringify(block).replace(/</g, '\\u003c')

/** Renders one or more JSON-LD blocks as <script type="application/ld+json">. */
export const StructuredData: React.FC<{ data: object | object[] }> = ({ data }) => {
  const blocks = Array.isArray(data) ? data : [data]
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serialize(block) }}
        />
      ))}
    </>
  )
}
