/**
 * Diablo Dark skin — 「暗黑·熔火」, a dark-gothic ambient theme for the
 * dsh web GUI. apply() owns the surface it writes and retracts it on
 * dispose (the ThemePresenter retraction discipline: the plugin only ever
 * removes what it wrote): the `data-dsh-diablo-dark` body attribute the
 * stylesheet is scoped on, and the injected flame favicon. The whole
 * palette remap + the ambient ember/magma backdrop ride the bundle's
 * CSS-modules auto-inject (a `<style data-plugin>` tag owned by the loader,
 * removed on entry dispose), and switch with the base theme system via
 * `body[data-dsh-diablo-dark][data-ds-dark-theme]`. No services are
 * injected: the skin needs only the DOM. No static assets are carried:
 * the favicon is an inline SVG, the backdrop is procedural CSS gradients.
 */
import type { Context } from '@deepseek-ai/cordis'
import './diablo-dark.module.css'

/** A stylized flame mark (generic vector, not any third-party logo). */
const FLAME_SVG = [
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">',
  '<rect width="16" height="16" rx="3.2" fill="#0a0807"/>',
  '<path d="M8 1.2c1.3 2.6 4.3 3.2 4.3 6.3 0 2.9-1.9 5.1-4.3 5.1S3.7 10.4 3.7 7.5c0-1.2.4-2.4 1.1-3.3.3 1 .9 1.8 1.8 2.2C7.1 4.3 7.5 2.9 8 1.2Z" fill="#b3271e"/>',
  '<circle cx="8" cy="8.7" r="1.5" fill="#c9993a"/>',
  '</svg>',
].join('')

/**
 * Apply the Diablo Dark skin: body attribute + flame favicon. All writes are
 * retracted by the effect disposer on dispose.
 * @param ctx - owning context (the effect lifecycle owns retraction).
 */
export function apply(ctx: Context): void {
  const body = document.body
  body.dataset.dshDiabloDark = ''

  const favicon = document.createElement('link')
  favicon.rel = 'icon'
  favicon.type = 'image/svg+xml'
  favicon.href = `data:image/svg+xml;utf8,${encodeURIComponent(FLAME_SVG)}`
  document.head.append(favicon)

  ctx.effect(() => () => {
    delete body.dataset.dshDiabloDark
    favicon.remove()
  }, 'ui-skin-diablo-dark: flame favicon')
}
