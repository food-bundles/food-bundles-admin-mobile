export const font = {
  displayBold: 'SpaceGrotesk_700Bold',
  displaySemi: 'SpaceGrotesk_600SemiBold',
  bodyRegular: 'IBMPlexSans_400Regular',
  bodyMedium: 'IBMPlexSans_500Medium',
  bodySemi: 'IBMPlexSans_600SemiBold',
} as const;

export const text = {
  display: { fontFamily: font.displayBold, fontSize: 32, lineHeight: 36, letterSpacing: -0.6 },
  h1: { fontFamily: font.displayBold, fontSize: 24, lineHeight: 28, letterSpacing: -0.2 },
  h2: { fontFamily: font.displaySemi, fontSize: 20, lineHeight: 24 },
  h3: { fontFamily: font.displaySemi, fontSize: 17, lineHeight: 21 },
  bodyLarge: { fontFamily: font.bodyRegular, fontSize: 16, lineHeight: 22 },
  body: { fontFamily: font.bodyRegular, fontSize: 14, lineHeight: 20 },
  bodySemi: { fontFamily: font.bodySemi, fontSize: 14, lineHeight: 20 },
  label: { fontFamily: font.bodySemi, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: font.bodyRegular, fontSize: 12, lineHeight: 17 },
  micro: { fontFamily: font.bodySemi, fontSize: 11, lineHeight: 15 },
  overline: {
    fontFamily: font.bodySemi,
    fontSize: 10.5,
    lineHeight: 14,
    letterSpacing: 0.7,
    textTransform: 'uppercase' as const,
  },
  priceHero: { fontFamily: font.displayBold, fontSize: 32, lineHeight: 36, letterSpacing: -0.3 },
  priceLg: { fontFamily: font.displayBold, fontSize: 22, lineHeight: 26 },
  priceMd: { fontFamily: font.displayBold, fontSize: 16, lineHeight: 20 },
} as const;
