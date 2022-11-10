import { Factory } from 'fishery'
import { Either, isRight } from 'fp-ts/Either'
import nock from 'nock'

import { getSoldListings } from './huutonet.api'

const API_BASE_URL = 'https://api.huuto.net/1.1'

type HuutoListingItem = {
  links: { self: string; category: string; alternative: string; images: string }
  id: number
  title: string
  category: string
  seller: string
  sellerId: number
  currentPrice: number
  buyNowPrice: number | null
  saleMethod: string
  listTime: string
  closingTime: string
  bidderCount: number
}

const listingItemFactory = Factory.define<HuutoListingItem>(({ params, sequence }) => {
  const { id = sequence } = params

  return {
    links: {
      self: `https://api.huuto.net/1.1/items/${id}`,
      category: 'https://api.huuto.net/1.1/categories/457',
      alternative: `https://www.huuto.net/kohteet/nes-mr-gimmcik/${id}`,
      images: `https://api.huuto.net/1.1/items/${id}/images`,
    },
    id,
    title: 'NES Mr. Gimmick',
    category: 'Nintendo-pelit',
    seller: 'seller nick',
    sellerId: 12345678,
    currentPrice: 22,
    buyNowPrice: 22,
    saleMethod: 'buy-now',
    listTime: '2022-10-23T18:43:14+0300',
    closingTime: '2022-10-23T18:43:14+0300',
    bidderCount: 1,
    offerCount: 0,
    hasReservePrice: false,
    hasReservePriceExceeded: false,
  }
})

type ListingItemResponse = {
  totalCount: number
  links: { next: string | null; last: string; first: string }
  updated: string
  items: HuutoListingItem[]
}

const listingResponseFactory = Factory.define<ListingItemResponse>(() => {
  return {
    totalCount: 50,
    updated: '2022-11-10T14:12:20+0200',
    links: {
      next: null,
      last: 'https://api.huuto.net/1.1/items?page=1',
      first: 'https://api.huuto.net/1.1/items?page=1',
    },
    items: [],
  }
})

const fromRight = <T>(input: Either<unknown, T>) => {
  if (!isRight(input)) throw new Error('Expected right')
  return input.right
}

const nockGetItems = nock(API_BASE_URL).get('/items').query(true)

describe('Huuto API', () => {
  it('resolves decoding error when malformed response', async () => {
    nockGetItems.reply(200, 'Definitely not JSON')

    await expect(getSoldListings()()).resolves.toEqualLeft(new Error('Failed to decode'))
  })

  it('transforms iso date strings to Date object', async () => {
    nockGetItems.reply(
      200,
      listingResponseFactory.build({
        items: [
          listingItemFactory.build({
            closingTime: '2022-11-24T14:12:02+0200',
            listTime: '2022-07-11T10:20:30+0300',
          }),
        ],
      }),
    )

    const response = await getSoldListings()()
    const { items } = fromRight(response)

    expect(items[0]).toMatchObject({
      closingTime: new Date('2022-11-24T14:12:02+0200'),
      listTime: new Date('2022-07-11T10:20:30+0300'),
    })
  })

  it('excludes items having 0 bidders', async () => {
    nockGetItems.reply(
      200,
      listingResponseFactory.build({
        items: [
          listingItemFactory.build({ id: 6666, bidderCount: 0 }),
          listingItemFactory.build({ id: 7777, bidderCount: 1 }),
          listingItemFactory.build({ id: 8888, bidderCount: 5 }),
          listingItemFactory.build({ id: 9999, bidderCount: 0 }),
        ],
      }),
    )

    const response = await getSoldListings()()
    const { items } = fromRight(response)

    expect(items).toHaveLength(2)
    expect(items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 7777 }), // nl
        expect.objectContaining({ id: 8888 }),
      ]),
    )
  })
})
