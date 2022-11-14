import request from 'supertest'

import { createServer } from './server'

let app: Awaited<ReturnType<typeof createServer>>
beforeAll(async () => {
  app = await createServer()
})

describe('server', () => {
  it('serves health', async () => {
    await request(app).get('/_health').expect(200)
  })
})
