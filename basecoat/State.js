/* rollup-tree-shake pure */

import React from 'react'
import classNames from 'classnames'

import { omit } from './util'

import './state.scss'

export const State = props => {
    const {
        open,
        proposed,
        reopened,
        closed,
        merged,
        className,
    } = props

    const other = omit(props, [
        'open',
        'proposed',
        'reopened',
        'closed',
        'merged',
        'className',
    ])

    const classes = classNames('state', {
        'state-open': open,
        'state-proposed': proposed,
        'state-reopened': reopened,
        'state-closed': closed,
        'state-merged': merged,
    }, className)

    return <span className={classes} {...other}>{props.children}</span>
}
