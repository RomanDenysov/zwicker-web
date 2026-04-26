import Link from 'next/link'
import React from 'react'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { getSettings } from '@/Settings/getSettings'
import { getCachedGlobal } from '@/utilities/getGlobals'

export async function Footer() {
  const [footerData, settings] = await Promise.all([
    getCachedGlobal('footer', 1)(),
    getSettings(),
  ])

  const navItems = footerData?.navItems || []
  const year = new Date().getFullYear()

  return (
    <footer
      data-theme="dark"
      className="mt-auto bg-dark text-dark-foreground"
    >
      <div className="container py-20">
        <div className="grid gap-14 md:grid-cols-[1.2fr_1fr_1fr] pb-14 border-b border-dark-border">
          <div>
            <Logo size="lg" className="block mb-5" />
            {settings.siteDescription && (
              <p className="text-sm leading-relaxed text-dark-muted max-w-[300px]">
                {settings.siteDescription}
              </p>
            )}
          </div>
          {navItems.length > 0 && (
            <div>
              <h4 className="text-label text-dark-subtle mb-5">Navigácia</h4>
              <ul className="flex flex-col gap-2">
                {navItems.map(({ link }, i) => (
                  <li key={i}>
                    <CMSLink
                      {...link}
                      appearance="inline"
                      className="text-sm text-dark-muted hover:text-dark-foreground transition-colors"
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex flex-col gap-5">
            <h4 className="text-label text-dark-subtle mb-0">Kontakt</h4>
            {settings.address && (
              <ContactLine label="Adresa" value={settings.address} />
            )}
            {settings.phone && (
              <ContactLine label="Telefón" value={settings.phone} href={`tel:${settings.phone.replace(/\s/g, '')}`} />
            )}
            {settings.email && (
              <ContactLine label="E-mail" value={settings.email} href={`mailto:${settings.email}`} />
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pt-6">
          <span className="text-xs tracking-wide text-dark-subtle">
            {'©'} {year} Zwicker. Všetky práva vyhradené.
          </span>
          <div className="flex gap-5">
            {settings.instagram && (
              <SocialLink href={settings.instagram} label="Instagram" />
            )}
            {settings.facebook && (
              <SocialLink href={settings.facebook} label="Facebook" />
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

function ContactLine({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div>
      <div className="text-label text-dark-subtle mb-1">{label}</div>
      {href ? (
        <Link href={href} className="text-sm text-dark-muted hover:text-primary-light whitespace-pre-line transition-colors">
          {value}
        </Link>
      ) : (
        <span className="text-sm text-dark-muted whitespace-pre-line">{value}</span>
      )}
    </div>
  )
}

function SocialLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-label text-dark-subtle hover:text-primary-light transition-colors"
    >
      {label}
    </a>
  )
}
