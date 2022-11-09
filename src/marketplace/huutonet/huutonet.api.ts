import axios from 'axios'
import * as E from 'fp-ts/Either'
import * as F from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import * as t from 'io-ts'

const API_BASE_URL = 'https://api.huuto.net/1.1'

const huutoItem = t.type({
  id: t.number,
  title: t.string,
  seller: t.string,
  sellerId: t.number,
  currentPrice: t.number, // major units
  bidderCount: t.number,
  links: t.type({
    self: t.string, // https://api.huuto.net/1.1/items/<item id>
    category: t.string, // https://api.huuto.net/1.1/categories/<category id>,
    alternative: t.string, // https://www.huuto.net/kohteet/<seo slug>/<item id>',
    images: t.string, // https://api.huuto.net/1.1/items/<item id>/images',
  }),
})
const itemsHttpResponse = t.type({
  totalCount: t.number, // item count perhaps?
  updated: t.string, // datetime
  links: t.type({
    next: t.union([t.null, t.string]),
    first: t.union([t.null, t.string]),
    last: t.union([t.null, t.string]),
  }),
  items: t.array(huutoItem),
})

type ItemsFilter = {
  // 50 or 1-2-3
  category?: number | string
  status?: 'closed' | 'open'
  sellstyle?: 'all' | 'auction' | 'buy-now'
  sort?: 'newest' | 'default' | 'hits' | 'closing' | 'lowprice' | 'highprice' | 'bidders' | 'title'
  /** range 50-500 */
  limit?: number
  /** 1 based */
  page?: number
}

const http = axios.create({
  baseURL: API_BASE_URL,
})

export const getItems = (params: ItemsFilter = {}) => {
  const request = () =>
    http.get<unknown>('/items', {
      params,
    })

  return F.pipe(
    TE.tryCatch(request, E.toError),
    TE.chain((res) =>
      F.pipe(
        itemsHttpResponse.decode(res.data),
        E.fold(
          () => TE.left(new Error('Failed to decode')),
          (data) => TE.right({ ...res, data }),
        ),
      ),
    ),
  )
}

export const getSoldListings = (filter: Omit<ItemsFilter, 'status'> = {}) => {
  const params: ItemsFilter = {
    ...filter,
    status: 'closed',
  }

  const closedOnly = (items: t.TypeOf<typeof huutoItem>[]) => items.filter((item) => item.bidderCount >= 1)

  return F.pipe(
    getItems(params),
    TE.chain((res) =>
      TE.right({
        ...res,
        data: {
          ...res.data,
          items: closedOnly(res.data.items),
        },
      }),
    ),
  )
}
