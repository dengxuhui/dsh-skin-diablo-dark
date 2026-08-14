// @vitest-environment jsdom
/**
 * apply() owns the whole dark-gothic surface and retracts it on fiber
 * dispose: the body attribute the stylesheet is scoped on, the injected
 * flame favicon, the Google-Fonts stylesheet (+preconnects), and the
 * procedural background layer. Assert the writes and the teardown both ways.
 */
import { afterEach, describe, expect, it } from 'vitest'
import { Context, type Fiber } from '@deepseek-ai/cordis'
import { apply } from '../src/client/index.ts'

let fiber: Fiber | undefined

async function mount(): Promise<Fiber> {
  const f = new Context().plugin({ apply })
  await f.await()
  return f
}

afterEach(async () => {
  await fiber?.dispose()
  fiber = undefined
  document.body.innerHTML = ''
  document.head.querySelectorAll('link[rel="icon"], link[rel="preconnect"], link[rel="stylesheet"]').forEach((link) => { link.remove() })
  delete document.body.dataset.dshDiabloDark
})

describe('diablo-dark skin apply', () => {
  it('mounts the surface: body attribute, favicon, fonts, and background layer', async () => {
    fiber = await mount()

    expect(document.body.dataset.dshDiabloDark).toBe('')
    const icon = document.head.querySelector('link[rel="icon"]')
    expect(icon).not.toBeNull()
    expect(icon?.getAttribute('href')).toContain('data:image/png')
    expect(icon?.getAttribute('type')).toBe('image/png')
    const stylesheet = document.head.querySelector('link[rel="stylesheet"][href*="fonts.googleapis.com"]')
    expect(stylesheet).not.toBeNull()
    const bg = document.body.querySelector('[data-dsh-diablo-bg]')
    expect(bg).not.toBeNull()
    expect(bg?.querySelector('[data-rune="blood"]')).not.toBeNull()
  })

  it('retracts everything on fiber dispose', async () => {
    fiber = await mount()
    await fiber.dispose()
    fiber = undefined

    expect(document.body.dataset.dshDiabloDark).toBeUndefined()
    expect(document.head.querySelector('link[rel="icon"]')).toBeNull()
    expect(document.head.querySelector('link[rel="stylesheet"][href*="fonts.googleapis.com"]')).toBeNull()
    expect(document.body.querySelector('[data-dsh-diablo-bg]')).toBeNull()
  })
})
