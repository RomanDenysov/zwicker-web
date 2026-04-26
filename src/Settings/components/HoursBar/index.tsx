import { getSettings } from '@/Settings/getSettings'
import { cn } from '@/utilities/ui'

type Props = {
  variant?: 'horizontal' | 'vertical'
  className?: string
}

export async function HoursBar({ variant = 'horizontal', className }: Props) {
  const settings = await getSettings()

  if (!settings.openingHours?.length) return null

  return (
    <div
      className={cn(
        'hours-bar',
        variant === 'horizontal' ? 'flex gap-6 items-center' : 'flex flex-col gap-2',
        className,
      )}
    >
      {variant === 'vertical' && (
        <span className="text-xs tracking-wider uppercase text-muted-foreground">
          Otváracie hodiny
        </span>
      )}
      {settings.openingHours.map((row, i) => (
        <div key={i} className="flex gap-3">
          <span className="font-medium">{row.days}</span>
          <span>{row.hours}</span>
        </div>
      ))}
      {settings.closedNote && (
        <span className="text-sm text-muted-foreground">{settings.closedNote}</span>
      )}
    </div>
  )
}
