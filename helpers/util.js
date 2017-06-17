
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

/**
 * Function is a compare function for alphanumeric strings (i.e. well ids)
 *
 * Comparisons are case insensitive, and a sort on the following set:
 *     MW-3, MW-1, MA-9
 * should return:
 *     MA-9, MW-1, MW-3
 */

const alphaRegEx = /^[a-zA-Z]*/g
const numericRegEx = /^[0-9]*/g

const nonAlphaNumericRegEx = /^[^a-zA-Z0-9]*/g

export const compareAlphaNumeric = (a, b) => {
  let regex = null
  let i = 0

  while (a.length && b.length ) {
    
    a = a.replace(nonAlphaNumericRegEx, '')
    b = b.replace(nonAlphaNumericRegEx, '')

    regex = i%2===0 ? alphaRegEx : numericRegEx
    i++

    let aStr = a.match(regex)[0]
    let bStr = b.match(regex)[0]

    a = a.replace(regex, '')
    b = b.replace(regex, '')

    if (aStr === bStr) { continue }
    else if (regex === numericRegEx) {
      aStr = parseInt(aStr)
      bStr = parseInt(bStr)

      return aStr > bStr ? 1 : -1
    } else {
      return aStr.toLowerCase() > bStr.toLowerCase() ? 1 : -1
    }
  }

  if (a.length) { return 1 }
  else if (b.length) { return -1 }
  else { return 0 }
}

export const hashids = new Hashids('SampleServe', 8, 'abcdefghijklmnopqrstuvwxyz')
