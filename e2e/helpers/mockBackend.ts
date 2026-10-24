import type { Page } from '@playwright/test'

/** Block outbound chat/content/OSRM and mock chat proxy responses. */
export const installAuditMocks = async (page: Page) => {
  await page.route('**/chat/**', async (route) => {
    const url = route.request().url()
    const method = route.request().method()
    if (url.includes('/chat/session') && method === 'POST') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ conversationId: 'audit-conv', identity: { id: 'audit' } }),
      })
    }
    if (url.includes('/chat/guided')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ steps: [] }),
      })
    }
    if (url.includes('/chat/history')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ messages: [] }),
      })
    }
    if (url.includes('/chat/message') && method === 'POST') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          messages: [
            {
              id: 'm1',
              role: 'assistant',
              text: 'Audit mock reply https://example.com and also see javascript:alert(1)',
            },
          ],
          options: [{ id: 'o1', label: 'Quote', href: '/en/quote' }],
        }),
      })
    }
    if (url.includes('/chat/upload')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      })
    }
    return route.fulfill({ status: 404, body: 'mocked-block' })
  })

  await page.route('**/router.project-osrm.org/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"routes":[]}' }),
  )

  await page.route('**/104-248-198-154.sslip.io/**', (route) =>
    route.fulfill({ status: 503, body: 'blocked-by-audit' }),
  )

  await page.route('**/api.resend.com/**', (route) =>
    route.fulfill({ status: 503, body: 'blocked-by-audit' }),
  )
}
