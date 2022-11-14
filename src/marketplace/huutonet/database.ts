import { DatabaseConnection, DatabaseTransactionConnection, sql } from 'slonik'
import z from 'zod'

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
  INSERT INTO huuto_net_raw_sold_events(
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

export const findAll = async (conn: DatabaseConnection | DatabaseTransactionConnection) => {
  return conn.many(sql.type(huutoItem)`
  SELECT *
  FROM huuto_net_raw_sold_events
  `)
}
