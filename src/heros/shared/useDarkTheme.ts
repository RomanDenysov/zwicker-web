'use client'

import { useEffect } from 'react'

import { useHeaderTheme } from '@/providers/HeaderTheme'

export function useDarkTheme() {
  const { setHeaderTheme } = useHeaderTheme()
  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])
}
