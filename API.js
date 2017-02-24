/* global fetch */

const API_BASE = 'http://127.0.0.1:5000/api/v1'

const API = {}

API.get = url =>
    fetch(`${API_BASE}${url}`, {
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

API.post = (url, body) =>
    fetch(`${API_BASE}${url}`, {
        method: 'post',
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

API.patch = (url, body) =>
    fetch(`${API_BASE}${url}`, {
        method: 'patch',
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

API.delete = url =>
    fetch(`${API_BASE}${url}`, {
        method: 'delete',
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

export default API
