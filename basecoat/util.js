/* rollup-tree-shake pure */

export const omit = (object, paths) => Object.keys(object).reduce((result, key) => {
    if (!paths.includes(key)) {
        result[key] = object[key] // eslint-disable-line no-param-reassign
    }

    return result
}, {})
