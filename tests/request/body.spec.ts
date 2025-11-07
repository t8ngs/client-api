/*
 * @t8ngs/client-api
 *
 * (c) T8ngs
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@t8ngs/runner'
import { stringify, parse } from 'qs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

import { ApiRequest } from '../../src/request.js'
import { awaitStream, httpServer } from '../../tests_helpers/index.js'

test.group('Request | body', (group) => {
  group.each.setup(async () => {
    await httpServer.create()
    return () => httpServer.close()
  })

  test('send form body', async ({ assert }) => {
    httpServer.onRequest(async (req, res) => {
      const body = await awaitStream(req)
      res.statusCode = 200
      res.setHeader('content-type', 'application/json')
      res.end(JSON.stringify(parse(body)))
    })

    const request = new ApiRequest({
      baseUrl: httpServer.baseUrl,
      method: 'GET',
      endpoint: '/',
    }).dump()
    const response = await request.form({ username: 'Jefte', age: 22 })

    assert.equal(response.status(), 200)
    assert.deepEqual(response.body(), {
      username: 'Jefte',
      age: '22',
    })
  })

  test('send form with array values', async ({ assert, cleanup }) => {
    httpServer.onRequest(async (req, res) => {
      const body = await awaitStream(req)
      res.statusCode = 200
      res.setHeader('content-type', 'application/json')
      res.end(JSON.stringify(parse(body)))
    })

    ApiRequest.addSerializer('application/x-www-form-urlencoded', (value) => stringify(value))
    cleanup(() => ApiRequest.removeParser('application/x-www-form-urlencoded'))

    const request = new ApiRequest({
      baseUrl: httpServer.baseUrl,
      method: 'GET',
      endpoint: '/',
    }).dump()
    const response = await request.form({
      'usernames': ['Jefte'],
      'emails[]': 'jefteamorim@gmail.com',
      'age': 22,
    })

    assert.equal(response.status(), 200)
    assert.deepEqual(response.body(), {
      usernames: ['Jefte'],
      age: '22',
      emails: ['jefteamorim@gmail.com'],
    })
  })

  test('send json body', async ({ assert }) => {
    httpServer.onRequest(async (req, res) => {
      const body = await awaitStream(req)
      res.statusCode = 200
      res.setHeader('content-type', 'application/json')
      res.end(body)
    })

    const request = new ApiRequest({
      baseUrl: httpServer.baseUrl,
      method: 'GET',
      endpoint: '/',
    }).dump()
    const response = await request.json({ username: 'Jefte', age: 22 })

    assert.equal(response.status(), 200)
    assert.deepEqual(response.body(), {
      username: 'Jefte',
      age: 22,
    })
  })

  test('send multipart body', async ({ assert }) => {
    assert.plan(3)

    httpServer.onRequest(async (req, res) => {
      const body = await awaitStream(req)

      assert.match(req.headers['content-type']!, /multipart\/form-data; boundary/)
      assert.match(body, /jefte/)
      assert.match(body, /22/)
      res.statusCode = 200
      res.end()
    })

    const request = new ApiRequest({
      baseUrl: httpServer.baseUrl,
      method: 'GET',
      endpoint: '/',
    }).dump()
    await request.fields({ username: 'jefte', age: 22 })
  })

  test('attach files', async ({ assert }) => {
    assert.plan(4)

    httpServer.onRequest(async (req, res) => {
      const body = await awaitStream(req)

      assert.match(req.headers['content-type']!, /multipart\/form-data; boundary/)
      assert.match(body, /jefte/)
      assert.match(body, /22/)
      assert.match(body, /filename="package.json"/)
      res.statusCode = 200
      res.end()
    })

    const request = new ApiRequest({
      baseUrl: httpServer.baseUrl,
      method: 'GET',
      endpoint: '/',
    }).dump()
    await request
      .fields({ username: 'jefte', age: 22 })
      .file('package', join(dirname(fileURLToPath(import.meta.url)), '../../package.json'))
  })

  test('attach files with custom filename', async ({ assert }) => {
    assert.plan(4)

    httpServer.onRequest(async (req, res) => {
      const body = await awaitStream(req)

      assert.match(req.headers['content-type']!, /multipart\/form-data; boundary/)
      assert.match(body, /Jefte/)
      assert.match(body, /22/)
      assert.match(body, /filename="pkg.json"/)
      res.statusCode = 200
      res.end()
    })

    const request = new ApiRequest({
      baseUrl: httpServer.baseUrl,
      method: 'GET',
      endpoint: '/',
    }).dump()
    await request
      .fields({ username: 'Jefte', age: 22 })
      .file('package', join(dirname(fileURLToPath(import.meta.url)), '../../package.json'), {
        filename: 'pkg.json',
      })
  })
})
