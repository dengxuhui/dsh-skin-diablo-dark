// @vitest-environment jsdom
/**
 * apply() owns the whole dark-gothic surface and retracts it on fiber
 * dispose: the body attribute the stylesheet is scoped on, and the injected
 * flame favicon. Assert the writes and the teardown both ways.
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
  document.head.querySelectorAll('link[rel="icon"]').forEach((link) => { link.remove() })
  delete document.body.dataset.dshDiabloDark
})

describe('diablo-dark skin apply', () => {
  it('mounts the surface: body attribute and flame favicon', async () => {
    fiber = await mount()

    expect(document.body.dataset.dshDiabloDark).toBe('')
    const icon = document.head.querySelector('link[rel="icon"]')
    expect(icon).not.toBeNull()
    expect(icon?.getAttribute('href')).toContain('data:image/svg+xml')
  })

  it('retracts everything on fiber dispose', async () => {
    fiber = await mount()
    await fiber.dispose()
    fiber = undefined

    expect(document.body.dataset.dshDiabloDark).toBeUndefined()
    expect(document.head.querySelector('link[rel="icon"]')).toBeNull()
  })
})
