import { Download } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'

export const MenuDownloadButton: React.FC<{ locale?: 'sk' | 'en'; label?: string }> = ({
  locale = 'sk',
  label = 'Stiahnuť jedálny lístok (PDF)',
}) => (
  <Button asChild variant="outline" size="lg">
    <a href={`/menu/pdf?locale=${locale}`} target="_blank" rel="noopener noreferrer">
      <Download />
      {label}
    </a>
  </Button>
)
