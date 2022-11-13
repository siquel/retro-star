import express, { Express, Request, Response } from 'express'
import { createPool, createSqlTag } from 'slonik'
import z from 'zod'

import { config } from './config'

export const createServer = async () => {
  const app: Express = express()

  const pool = await createPool(config.database.url)
  const sql = createSqlTag({
    typeAliases: {
      id: z.object({
        id: z.number(),
      }),
      void: z.object({}).strict(),
    },
  })

  app.get('/_health', (req: Request, res: Response) => {
    res.json({ ok: true })
  })

  app.get('/', async (req: Request, res: Response) => {
    const one = await pool.one(sql.typeAlias('id')`SELECT 1 AS id`)
    console.log(one)
    res.send('Hello world!')
  })

  return app
}
