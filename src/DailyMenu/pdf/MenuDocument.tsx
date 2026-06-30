import type { DailyMenu } from '@/payload-types'

import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import React from 'react'

import { registerPdfFonts } from './fonts'

registerPdfFonts()

export type MenuLocale = 'sk' | 'en'

const LABELS: Record<MenuLocale, { subtitle: string; title: string; allergens: string }> = {
  sk: { subtitle: 'Reštaurácia a penzión', title: 'Jedálny lístok', allergens: 'Alergény' },
  en: { subtitle: 'Restaurant & pension', title: 'Menu', allergens: 'Allergens' },
}

const colors = {
  ink: '#1a1a1a',
  muted: '#6b6b6b',
  line: '#d9d4cb',
  accent: '#7a6a52',
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'DM Sans',
    fontSize: 10,
    color: colors.ink,
    paddingVertical: 56,
    paddingHorizontal: 64,
  },
  header: { marginBottom: 32, textAlign: 'center' },
  brand: { fontSize: 22, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' },
  subtitle: {
    fontSize: 8,
    fontWeight: 500,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: colors.muted,
    marginTop: 4,
  },
  title: { fontSize: 13, fontWeight: 500, color: colors.accent, marginTop: 14 },
  category: { marginBottom: 22, breakInside: 'avoid' },
  categoryName: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.accent,
    marginBottom: 10,
  },
  item: { marginBottom: 9 },
  itemRow: { flexDirection: 'row', alignItems: 'flex-end' },
  itemName: { fontSize: 10.5, fontWeight: 500 },
  leader: {
    flexGrow: 1,
    marginHorizontal: 6,
    marginBottom: 2,
    borderBottomWidth: 0.75,
    borderBottomColor: colors.line,
    borderBottomStyle: 'dashed',
  },
  price: { fontSize: 10.5, fontWeight: 700 },
  description: { fontSize: 8.5, color: colors.muted, marginTop: 2, maxWidth: '78%' },
  footer: {
    marginTop: 10,
    paddingTop: 12,
    borderTopWidth: 0.75,
    borderTopColor: colors.line,
  },
  footerTitle: {
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.muted,
    marginBottom: 4,
  },
  footerText: { fontSize: 8, color: colors.muted, lineHeight: 1.5 },
})

const formatPrice = (price: number) => `${price.toFixed(2)} €`

export const MenuDocument: React.FC<{ menu: DailyMenu; locale: MenuLocale }> = ({
  menu,
  locale,
}) => {
  const t = LABELS[locale]
  const categories = menu.categories ?? []

  return (
    <Document title={`${t.title} – Zwicker`} author="Zwicker">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>Zwicker</Text>
          <Text style={styles.subtitle}>{t.subtitle}</Text>
          <Text style={styles.title}>{t.title}</Text>
        </View>

        {categories.map((category, i) => (
          <View key={category.id ?? i} style={styles.category} wrap={false}>
            <Text style={styles.categoryName}>{category.name}</Text>
            {(category.items ?? []).map((item, j) => (
              <View key={item.id ?? j} style={styles.item}>
                <View style={styles.itemRow}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <View style={styles.leader} />
                  {typeof item.price === 'number' && (
                    <Text style={styles.price}>{formatPrice(item.price)}</Text>
                  )}
                </View>
                {item.description ? (
                  <Text style={styles.description}>{item.description}</Text>
                ) : null}
              </View>
            ))}
          </View>
        ))}

        {menu.allergenNote ? (
          <View style={styles.footer}>
            <Text style={styles.footerTitle}>{t.allergens}</Text>
            <Text style={styles.footerText}>{menu.allergenNote}</Text>
          </View>
        ) : null}
      </Page>
    </Document>
  )
}
