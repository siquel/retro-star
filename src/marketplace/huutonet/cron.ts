import * as E from 'fp-ts/Either'

import { Platform, tryExtractPlatform } from '../../common/platform/classifier'
import { getSoldListings } from './huutonet.api'
import { NES_REGION_CODES } from '../../common/platform/nes/region'
import { tryExtractGame } from '../../common/platform/nes/classifier'

const NES_REGION_CODE_REGEX = new RegExp(
  `asian version|(?:${Object.keys(NES_REGION_CODES).join('|')})\/?(?:${Object.keys(NES_REGION_CODES).join('|')})?`,
  'gi',
)
const COMPLETENESS_REGEX = /(?:\bCIB|loose|boxed\b)|\(\s*(?:L|B|LM)\s*\)|ei ohjeita/gi
const REGION_METADATA_REGEX = /\b(?:pal(?:[- ][ab])?|NTSC|USA|yapon(?:-\w+)?)\b/gi
const NES_RE = /(\bNintendo 8-?bit\b|\bnintendo NES\b|\bNES\b|\bNintendo Entertaiment System\b)/gi

const TRANSLATE = {
  ohjain: 'controller',
  pölysuoja: 'dust cover',
}

const sanitize = (input: string) => {
  let sanitized = input.replace(COMPLETENESS_REGEX, '')
  sanitized = sanitized.replace(NES_RE, '')
  sanitized = sanitized.replace(NES_REGION_CODE_REGEX, '')
  sanitized = sanitized.replace(REGION_METADATA_REGEX, '')
  sanitized = Object.entries(TRANSLATE).reduce(
    (agg, [what, to]) => agg.replace(new RegExp(`${what}`, 'ig'), to),
    sanitized,
  )
  sanitized = sanitized.replace(/[`~!@#$%^&*()_|+=?;,:<>{}\[\]\\]/gi, '')
  sanitized = sanitized.replace(/-(?=\s)/g, '')
  return sanitized.replace(/\s+/g, ' ').trim()
}

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
      // .map(
      //   (item) =>
      //     `${item.title}: Sold for ${item.currentPrice}€ - ${item.links.alternative} - Platform: ${tryExtractPlatform(
      //       item.title,
      //     )}`,
      // )
      .filter((item) => tryExtractPlatform(item.title) === Platform.NES)
      .map((item) => ({ ...item, identified: tryExtractGame(sanitize(item.title))?.title }))
      .map((item) => ({
        ...item,
        identified: item.identified ? `\x1b[32m${item.identified}\x1b[0m` : '\x1b[31mNOTHING\x1b[0m',
      }))
      .map(
        (item) =>
          `Original: \x1b[35m${item.title}\x1b[0m - Sanitized: \x1b[36m${sanitize(item.title)}\x1b[0m Identified as: ${
            item.identified
          }`,
      )
      .forEach((e) => console.log(e))
  } else {
    console.error(response.left)
  }
})()
