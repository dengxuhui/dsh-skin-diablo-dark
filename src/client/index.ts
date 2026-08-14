/**
 * Diablo Dark skin — 「暗黑·熔火」, a dark-gothic ambient theme for the dsh
 * web GUI. apply() owns every surface it writes and retracts it on dispose
 * (the ThemePresenter retraction discipline: the plugin only ever removes
 * what it wrote): the `data-dsh-diablo-dark` body attribute the stylesheet is
 * scoped on, the injected Google-Fonts stylesheet, the emblem favicon, and the
 * ambient background layer (stone texture + ember glow + self-drawn rune
 * cracks + vignette carried by a `[data-dsh-diablo-bg]` element). The whole
 * palette remap + the ambient chrome ride the bundle's CSS-modules auto-inject
 * (a `<style data-plugin>` tag owned by the loader, removed on entry dispose),
 * and switch with the base theme system via
 * `body[data-dsh-diablo-dark][data-ds-dark-theme]`. No services are injected:
 * the skin needs only the DOM. No static asset files are carried: the emblem
 * and the stone texture are downscaled data URIs, the rune layer is inline
 * SVG, the ember/vignette are procedural CSS gradients.
 */
import type { Context } from '@deepseek-ai/cordis'
import './diablo-dark.module.css'

/**
 * Brand emblem — the AI-generated Horadrim sigil downscaled to 48px and
 * inlined as a data URI (no static asset file is shipped). The base64 payload
 * is baked into the source at authoring time (downscaled from the design-time
 * asset; see docs/SKIN-DEV.md for the asset strategy).
 */
const EMBLEM_URI = 'data:image/png;base64,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'

/**
 * Web fonts for the gothic serif body, engraved-display headings, and mono
 * code stacks (all open-licensed via Google Fonts; the CSS stacks fall back
 * to system fonts when the CDN is unreachable).
 */
const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Alegreya:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Noto+Serif+SC:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap'

/**
 * Self-drawn crack + rune-geometry layer (procedural vectors, no third-party
 * artwork). Stroke colour rides `currentColor`; each group's `color` is
 * bound by the stylesheet to the theme's blood / gold / bone tokens so the
 * whole layer re-tints with the light/dark switch. The viewBox is stretched
 * across the viewport (`preserveAspectRatio="none"`) as ambient decoration.
 */
const RUNES_SVG = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="none" fill="none" aria-hidden="true">',
  '<g data-rune="blood" stroke="currentColor" stroke-width="1.4">',
  '<path d="M0 1000 L140 820 L180 850 L300 660 L360 700 L470 560"/>',
  '<path d="M1600 1000 L1440 740 L1380 780 L1220 560 L1150 600 L1040 470"/>',
  '<path d="M60 1000 L130 900 L210 920 L240 830"/>',
  '<path d="M1560 1000 L1490 880 L1410 900 L1360 800"/>',
  '</g>',
  '<g data-rune="gold" stroke="currentColor" stroke-width="1.2">',
  '<circle cx="1360" cy="200" r="150"/>',
  '<circle cx="1360" cy="200" r="120"/>',
  '<circle cx="1360" cy="200" r="90"/>',
  '<path d="M1360 40 L1360 360 M1210 200 L1510 200"/>',
  '<path d="M1254 94 L1466 306 M1466 94 L1254 306"/>',
  '</g>',
  '<g data-rune="bone" stroke="currentColor" stroke-width="1">',
  '<path d="M240 300 l10 -10 l10 10 l-10 10 Z"/>',
  '<path d="M760 180 l8 -8 l8 8 l-8 8 Z"/>',
  '<path d="M1180 700 l12 -12 l12 12 l-12 12 Z"/>',
  '<path d="M420 620 l7 -7 l7 7 l-7 7 Z"/>',
  '<path d="M900 820 l9 -9 l9 9 l-9 9 Z"/>',
  '</g>',
  '</svg>',
].join('')

/**
 * Apply the Diablo Dark skin: body attribute + flame favicon + web fonts +
 * background layer. All writes are retracted by the effect disposer on
 * dispose.
 * @param ctx - owning context (the effect lifecycle owns retraction).
 */
export function apply(ctx: Context): void {
  const body = document.body
  body.dataset.dshDiabloDark = ''

  const favicon = document.createElement('link')
  favicon.rel = 'icon'
  favicon.type = 'image/png'
  favicon.href = EMBLEM_URI

  const preconnectApi = document.createElement('link')
  preconnectApi.rel = 'preconnect'
  preconnectApi.href = 'https://fonts.googleapis.com'

  const preconnectGstatic = document.createElement('link')
  preconnectGstatic.rel = 'preconnect'
  preconnectGstatic.href = 'https://fonts.gstatic.com'
  preconnectGstatic.crossOrigin = 'anonymous'

  const fontSheet = document.createElement('link')
  fontSheet.rel = 'stylesheet'
  fontSheet.href = FONT_CSS

  const bg = document.createElement('div')
  bg.setAttribute('data-dsh-diablo-bg', '')
  bg.setAttribute('aria-hidden', 'true')
  bg.innerHTML = `<div data-dsh-diablo-texture></div><div data-dsh-diablo-mural></div>${RUNES_SVG}`

  document.head.append(favicon, preconnectApi, preconnectGstatic, fontSheet)
  body.prepend(bg)

  ctx.effect(() => () => {
    delete body.dataset.dshDiabloDark
    favicon.remove()
    preconnectApi.remove()
    preconnectGstatic.remove()
    fontSheet.remove()
    bg.remove()
  }, 'ui-skin-diablo-dark: chrome')
}
