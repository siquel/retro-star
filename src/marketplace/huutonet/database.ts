import { DatabaseConnection, DatabaseTransactionConnection, sql } from 'slonik'
import z from 'zod'

const EVENT_TABLE = sql.identifier(['huuto_net_raw_sold_events'])

const dateFromUnix = z.number().transform((unix) => new Date(unix))

const huutoItem = z.object({
  id: z.number(),
  huutoId: z.string(),
  soldWithAmount: z.number(),
  soldWithCurrency: z.string(),
  soldAt: dateFromUnix,
  listedAt: dateFromUnix,
  listingTitle: z.string(),
  listingDescription: z.string(),
  metadata: z.record(z.unknown()),
})

type HuutoSoldListing = Omit<z.infer<typeof huutoItem>, 'id'>

export const create = (conn: DatabaseConnection | DatabaseTransactionConnection, items: HuutoSoldListing[]) => {
  const asTuple = (item: typeof items[number]) => [
    item.huutoId,
    item.soldWithAmount,
    item.soldWithCurrency,
    item.soldAt.toISOString(),
    item.listedAt.toISOString(),
    item.listingTitle,
    item.listingDescription,
    JSON.stringify(item.metadata),
  ]

  return conn.query(sql.unsafe`
  INSERT INTO ${EVENT_TABLE}(
      huuto_id,
      sold_with_amount,
      sold_with_currency,
      sold_at,
      listed_at,
      listing_title,
      listing_description,
      metadata
   )
   SELECT *
   FROM ${sql.unnest(
     items.map((i) => asTuple(i)),
     ['text', 'numeric', 'text', 'timestamptz', 'timestamptz', 'text', 'text', 'jsonb'],
   )}
  `)
}

export const findAll = async (conn: DatabaseConnection | DatabaseTransactionConnection) => {
  return conn.many(sql.type(huutoItem)`
  SELECT *
  FROM ${EVENT_TABLE}
  `)
}

/**
 * Find the highest sold at timestamp.
 *
 * @param conn The database connections
 * @returns Date Highest sold at timestamp or epoch if table is empty.
 */
export const findHighestSoldAt = async (conn: DatabaseConnection | DatabaseTransactionConnection) => {
  const maxObject = z.object({ max: dateFromUnix })
  const EPOCH = new Date(0)

  return conn.oneFirst(sql.type(maxObject)`
  SELECT COALESCE(MAX(sold_at), ${sql.timestamp(EPOCH)}) as max
  FROM ${EVENT_TABLE}
  `)
}
