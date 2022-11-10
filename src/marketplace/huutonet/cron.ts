import * as E from 'fp-ts/Either'

import { tryExtractPlatform } from '../../common/platform/classifier'
import { getSoldListings } from './huutonet.api'
;(async () => {
  const response = await getSoldListings({
    category: 457, // nintendo-pelit
    sellstyle: 'all',
    sort: 'newest',
    limit: 500, // 50-500
    page: 1,
  })()
  if (E.isRight(response)) {
    response.right.items
      .map(
        (item) =>
          `${item.title}: Sold for ${item.currentPrice}€ - ${item.links.alternative} - Platform: ${tryExtractPlatform(
            item.title,
          )}`,
      )
      .forEach((e) => console.log(e))
  } else {
    console.error(response.left)
  }
})()
