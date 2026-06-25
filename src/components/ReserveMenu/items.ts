import type { LucideIcon } from 'lucide-react'
import { BedDouble, UtensilsCrossed } from 'lucide-react'

export type ReservationItem = {
  key: string
  label: string
  icon: LucideIcon
  /** Omit `href` when the engine isn't wired yet — renders the disabled "čoskoro" mock. */
  href?: string
}

// Single source of truth for the two reservation flows (Previo = hotel, Bookio = restaurant).
// Both the header dropdown (ReserveMenu) and the mobile menu render from this list, so wiring
// Bookio later is one edit: add `href` (or swap to a widget trigger) on the `table` item.
export const reservationItems: ReservationItem[] = [
  { key: 'room', label: 'Rezervovať izbu', href: '/rezervacia', icon: BedDouble },
  { key: 'table', label: 'Rezervovať stôl', icon: UtensilsCrossed },
]
