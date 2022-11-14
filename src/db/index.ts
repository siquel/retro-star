import { createPool as slonikCreatePool, Interceptor, QueryResultRow, SchemaValidationError } from 'slonik'
import { createFieldNameTransformationInterceptor } from 'slonik-interceptor-field-name-transformation'

import { config } from '../config'

// Credit: https://github.com/gajus/slonik#result-parser-interceptor
const createResultParserInterceptor = (): Interceptor => {
  return {
    transformRow: (executionContext, actualQuery, row) => {
      const { resultParser } = executionContext

      if (!resultParser) {
        return row
      }

      const validationResult = resultParser.safeParse(row)

      if (!validationResult.success) {
        // @ts-expect-error Docs seem to say row is SerializableValue, but it isn't?
        throw new SchemaValidationError(actualQuery, row, validationResult.error.issues)
      }

      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      return validationResult.data as QueryResultRow
    },
  }
}

export const createPool = async (cfg: typeof config['database']) => {
  return slonikCreatePool(cfg.url, {
    interceptors: [
      createFieldNameTransformationInterceptor({
        format: 'CAMEL_CASE',
      }),
      createResultParserInterceptor(),
    ],
  })
}
