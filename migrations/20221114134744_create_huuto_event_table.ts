import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
  CREATE TABLE IF NOT EXISTS huuto_net_raw_sold_events (
      id SERIAL PRIMARY KEY,
      huuto_id varchar UNIQUE NOT NULL,
      sold_with_amount numeric(15, 4) NOT NULL,
      sold_with_currency varchar(3) NOT NULL,
      sold_at timestamptz NOT NULL,
      listed_at timestamptz NOT NULL,
      listing_title varchar NOT NULL,
      listing_description TEXT NOT NULL,
      metadata JSONB NOT NULL
  )
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TABLE huuto_net_raw_sold_events')
}
