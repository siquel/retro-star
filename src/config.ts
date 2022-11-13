const throwIfUndefined = <T>(anything?: T): T => {
  if (anything === undefined) throw new TypeError('Expected value to be defined but was undefined')
  return anything
}

export const config = {
  database: {
    url: throwIfUndefined(process.env.DATABASE_URL),
  },
} as const
