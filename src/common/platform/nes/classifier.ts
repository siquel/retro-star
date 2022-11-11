import Fuse from 'fuse.js'

import { getNesAccessories } from './accessories'
import { getNesGames } from './games'

const fuse = new Fuse(getNesGames().concat(getNesAccessories()), {
  isCaseSensitive: false,
  includeScore: true,
  shouldSort: true,
  threshold: 0.3,
  keys: ['title', 'aliases'],
  minMatchCharLength: 3,
})

export const tryIdentifyProduct = (searchString: string) => {
  if (searchString === null) return undefined

  const search = fuse.search(searchString)
  return search[0]?.item
}
