import { DatabaseTransactionConnection } from 'slonik'

import { config } from '../../config'
import { createPool } from '../../db'
import { create, findAll } from './database'

let pool: Awaited<ReturnType<typeof createPool>>

beforeAll(async () => {
  pool = await createPool(config.database)
})

afterAll(async () => {
  await pool.end()
})

const runInTransaction = async (fn: (tx: DatabaseTransactionConnection) => Promise<any>) => {
  try {
    await pool.transaction(async (tx) => {
      await fn(tx)

      throw new Error('Intentional Rollback')
    })
  } catch (ex: any) {
    if (ex?.message !== 'Intentional Rollback') {
      throw ex
    }
  }
}

describe('Database', () => {
  it('inserts', async () => {
    await runInTransaction(async (tx) => {
      await create(tx, [
        {
          huutoId: 'huuto_id',
          soldWithAmount: 100,
          soldWithCurrency: 'EUR',
          listedAt: new Date(Date.parse('2022-10-30T03:59:59.999+03:00')),
          soldAt: new Date(Date.parse('2022-10-30T01:00:00.000+00:00')),
          listingTitle: 'Listing Title',
          listingDescription: 'Long long description',
          metadata: { foo: 'bar' },
        },
      ])

      const res = await findAll(tx)
      expect(res).toHaveLength(1)
      expect(res[0].listedAt).toEqual(new Date(Date.parse('2022-10-30T00:59:59.999+00:00')))
      expect(res[0].soldAt).toEqual(new Date(Date.parse('2022-10-30T03:00:00.000+02:00')))
    })
  })
})
