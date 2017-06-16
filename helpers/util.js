
import Hashids from 'hashids'

export const omit = (object, paths) => Object.keys(object).reduce((result, key) => {
    if (!paths.includes(key)) {
        result[key] = object[key] // eslint-disable-line no-param-reassign
    }

    return result
}, {})

/**
 * Returns a human-readable error message from an API error.
 *
 * @param  {Object} error { key: String, validator: String (minSize, unique_constraint, etc) }
 * @return {String}
 */
export const msgFromError = error => {
    if (error.message) {
        return error.message
    }

    if (error.msg) {
      return error.msg
    }

    if (error.validator === 'unique_constraint') {
        return `That ${error.key} is already taken. Try another.`
    } else if (error.validator === 'minLength') {
        return `That ${error.key} is too short.`
    } else if (error.validator === 'pattern' || error.validator === 'type') {
        return `That does not appear to be a valid ${error.key}.`
    } else if (error.key) {
      return `Sorry, there was an error with that ${error.key}.`
    }

    return 'Sorry, there was an error.'
}

export const hashids = new Hashids('SampleServe', 8, 'abcdefghijklmnopqrstuvwxyz')
