import { Factory } from 'fishery'
import { DatabaseTransactionConnection } from 'slonik'

import { config } from '../../config'
import { createPool } from '../../db'
import { create, findAll, findHighestSoldAt } from './database'

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

const inputFactory = Factory.define<Parameters<typeof create>[1][number]>(({ sequence }) => {
  return {
    huutoId: `huuto_id_${sequence}`,
    soldWithAmount: 100,
    soldWithCurrency: 'EUR',
    listedAt: new Date(),
    soldAt: new Date(),
    listingTitle: 'Listing Title',
    listingDescription: 'Long long description',
    metadata: {},
  }
})

describe('Database', () => {
  it('inserts one', async () => {
    await runInTransaction(async (tx) => {
      await create(tx, [
        inputFactory.build({
          huutoId: 'huuto_id',
          listedAt: new Date(Date.parse('2022-10-30T03:59:59.999+03:00')),
          soldAt: new Date(Date.parse('2022-10-30T01:00:00.000+00:00')),
        }),
      ])

      const res = await findAll(tx)
      expect(res).toHaveLength(1)
      expect(res[0].listedAt).toEqual(new Date(Date.parse('2022-10-30T00:59:59.999+00:00')))
      expect(res[0].soldAt).toEqual(new Date(Date.parse('2022-10-30T03:00:00.000+02:00')))
    })
  })

  it('inserts many', async () => {
    await runInTransaction(async (tx) => {
      await create(tx, [
        inputFactory.build({ huutoId: '6666', listingTitle: 'a' }),
        inputFactory.build({ huutoId: '7777', listingTitle: 'b' }),
        inputFactory.build({ huutoId: '8888', listingTitle: 'c' }),
      ])

      const result = await findAll(tx)
      expect(result).toHaveLength(3)
      expect(result).toIncludeAllPartialMembers([
        { huutoId: '6666', listingTitle: 'a' },
        { huutoId: '7777', listingTitle: 'b' },
        { huutoId: '8888', listingTitle: 'c' },
      ])
    })
  })

  it('returns epoch when table is empty', async () => {
    await runInTransaction(async (tx) => {
      const res = await findHighestSoldAt(tx)
      expect(res).toEqual(new Date(0))
    })
  })

  it('returns latest sold time when table is non empty', async () => {
    await runInTransaction(async (tx) => {
      await create(tx, [
        inputFactory.build({ huutoId: 'id', soldAt: new Date(Date.parse('2022-11-15T19:00:00.000+02:00')) }),
        inputFactory.build({ huutoId: 'id2', soldAt: new Date(Date.parse('2022-11-14T20:00:00.000+02:00')) }),
        inputFactory.build({ huutoId: 'id3', soldAt: new Date(Date.parse('2022-11-16T21:00:00.000+02:00')) }),
        inputFactory.build({ huutoId: 'id4', soldAt: new Date(Date.parse('2022-11-13T22:00:00.000+02:00')) }),
      ])
      const res = await findHighestSoldAt(tx)
      expect(res).toEqual(new Date(Date.parse('2022-11-16T21:00:00.000+02:00')))
    })
  })
})
