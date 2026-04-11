/**
 * U+FE0E (VS15) — richiede la variante “testo” invece della presentazione emoji
 * (frecce e simili su iOS/Safari altrimenti diventano emoji colorate).
 */
export const VS15 = '\uFE0E'

export const GLYPH = {
  arrowRight: `\u2192${VS15}`,
  arrowLeft: `\u2190${VS15}`,
  arrowNE: `\u2197${VS15}`,
}
