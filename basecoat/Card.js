/* rollup-tree-shake pure */

import React from 'react'
import classNames from 'classnames'

import { omit } from './util'

import './card.scss'

export const Card = props => {
    const { className } = props
    const other = omit(props, ['className'])
    const classes = classNames('card', className)

    return <div className={classes} {...other}>{props.children}</div>
}
