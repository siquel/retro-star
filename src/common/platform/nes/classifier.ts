import Fuse from 'fuse.js'

import { games } from './games'

const fuse = new Fuse(games, {
  isCaseSensitive: false,
  includeScore: true,
  shouldSort: true,
  threshold: 0.35,
  keys: ['title', 'aliases'],
})

export const tryExtractGame = (searchString: string) => {
  return fuse.search(searchString)[0]?.item
}
