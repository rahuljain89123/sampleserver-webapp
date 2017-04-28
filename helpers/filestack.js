
export const FILESTACK_API_KEY = 'ATg3pguKNRI2jg6wRHiydz'

/**
 *
 * Provides a FileStack Url for an image that is resized to be at a
 * a maximum height and width.
 *
 * see: https://www.filestack.com/docs/image-transformations/resize
 * @param {string} imageUrl
 * @param {Object} opts - accepted keys: 'width', 'height', 'fit'
 *
 */
export const resizedImageUrl = (imageUrl, opts = {}) => {
  if (!opts.fit) { opts.fit = 'max' }
  const optionsString = Object.entries(opts).map((arr)=> `${arr[0]}:${arr[1]}`)

  const param = `resize=${optionsString.join(',')}`

  return `https://process.filestackapi.com/${FILESTACK_API_KEY}/${param}/${imageUrl}`
}
