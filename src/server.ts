import express, { Express, Request, Response } from 'express'

export const createServer = () => {
  const app: Express = express()

  app.get('/_health', (req: Request, res: Response) => {
    res.json({ ok: true })
  })

  app.get('/', (req: Request, res: Response) => {
    res.send('Hello world!')
  })

  return app
}
