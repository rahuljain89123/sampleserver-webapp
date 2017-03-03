/* rollup-tree-shake pure */

import React from 'react'
import classNames from 'classnames'

import { omit } from './util'

import './breadcrumb.scss'

export const Breadcrumb = props => (
    <nav {...props}>
        <ol>
            {props.children}
        </ol>
    </nav>
)

export const BreadcrumbItem = props => {
    const {
        href,
        className,
    } = props

    const other = omit(props, [
        'href',
        'className',
    ])

    const classes = classNames('breadcrumb-item', className)
    const inner = href ? (
        <a href={href}>{props.children}</a>
    ) : props.children

    return <li className={classes} {...other}>{inner}</li>
}
