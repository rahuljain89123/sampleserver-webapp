/* global fetch */

import store from './store'

const PROTOCOL = 'http://'
const API_BASE = '.sampleserve.dev/api/v1'

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
            return response.json()
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
