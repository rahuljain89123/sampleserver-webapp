/* rollup-tree-shake pure */

import React from 'react'
import classNames from 'classnames'

import { omit } from './util'

import './table.scss'

export const DataTable = props => {
    const {
        className,
    } = props

    const other = omit(props, [
        'className',
    ])

    const classes = classNames('data-table', className)

    return <table className={classes} {...other}>{props.children}</table>
}
