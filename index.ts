/*
 * @t8ngs/client-api
 *
 * (c) T8ngs
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { PluginFn } from '@t8ngs/runner/types'
import { ApiClient } from './src/client.js'
import { TestContext } from '@t8ngs/runner/core'

export { ApiClient }
export { ApiRequest } from './src/request.js'
export { ApiResponse } from './src/response.js'

/**
 * API client plugin registers an HTTP request client that
 * can be used for testing API endpoints.
 */
export function apiClient(options?: string | { baseURL?: string }): PluginFn {
  return function () {
    TestContext.getter(
      'client',
      function (this: TestContext) {
        return new ApiClient(typeof options === 'string' ? options : options?.baseURL, this.assert)
      },
      true
    )
  }
}

declare module '@t8ngs/runner/core' {
  interface TestContext {
    client: ApiClient
  }
}
