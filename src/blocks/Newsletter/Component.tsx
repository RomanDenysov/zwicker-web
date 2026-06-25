import React from 'react'

import type { NewsletterBlock as NewsletterBlockProps } from '@/payload-types'

export const NewsletterBlock: React.FC<NewsletterBlockProps> = ({
  heading,
  body,
  ctaLabel,
  disclaimer,
  formEndpoint,
}) => (
  <section className="py-24 bg-background-muted">
    <div className="container text-center max-w-3xl">
      <h2 className="text-h2">{heading}</h2>
      {body && <p className="text-base text-foreground-muted mt-4">{body}</p>}
      <form
        action={formEndpoint || undefined}
        method="post"
        className="flex flex-col md:flex-row gap-0 max-w-xl mx-auto mt-8"
      >
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          inputMode="email"
          aria-label="E-mail"
          placeholder="Váš e-mail"
          className="flex-1 px-5 py-4 bg-card border border-border-strong rounded md:rounded-r-none focus:outline-none focus:border-primary text-base"
        />
        <button
          type="submit"
          className="px-8 py-4 bg-primary hover:bg-primary-light text-primary-foreground text-label rounded md:rounded-l-none transition-[background-color,transform] duration-150 ease-out-quint active:scale-[0.98]"
        >
          {ctaLabel || 'Odoberať'}
        </button>
      </form>
      {disclaimer && <p className="text-xs text-foreground-muted mt-4">{disclaimer}</p>}
    </div>
  </section>
)
