/* global fetch */

import 'whatwg-fetch'
import store from './store'

const IS_DEV = window.location.hostname.indexOf('sampleserve.dev') > 0

const PROTOCOL = `${window.location.protocol}//`
const API_BASE = IS_DEV ? '.sampleserve.dev/api/v1' : '.sampleserve.net/api/v1'

const API = {}

API.get = url => {
  const subdomain = store.getState().get('currentLabUrl')

  return fetch(`${PROTOCOL}${subdomain}${API_BASE}${url}`, {
    credentials: 'include',
  })
  .then(response => {
    if (response.status >= 200 && response.status < 300) {
      return response.json()
    }

    const error = new Error(response.statusText)
    error.response = response
    throw error
  })
}

API.post = (url, body) => {
  const subdomain = store.getState().get('currentLabUrl')

  return fetch(`${PROTOCOL}${subdomain}${API_BASE}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    credentials: 'include',
  })
  .then(response => {
      if (response.status >= 200 && response.status < 300) {
        const contentType = response.headers.get('content-type')
        if (contentType === 'application/json') {
          return response.json()
        } else if (contentType === 'application/pdf') {
          return response.blob()
        } else {
          return response.body
        }
      }

      const error = new Error(response.statusText)
      error.response = response
      throw error
  })
}

API.patch = (url, body) => {
  const subdomain = store.getState().get('currentLabUrl')

  return fetch(`${PROTOCOL}${subdomain}${API_BASE}${url}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    credentials: 'include',
  })
  .then(response => {
    if (response.status >= 200 && response.status < 300) {
      return response.json()
    }

    const error = new Error(response.statusText)
    error.response = response
    throw error
  })
}

API.delete = url => {
  const subdomain = store.getState().get('currentLabUrl')

  return fetch(`${PROTOCOL}${subdomain}${API_BASE}${url}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  .then(response => {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve()
    }

    const error = new Error(response.statusText)
    error.response = response
    throw error
  })
}

export default API
