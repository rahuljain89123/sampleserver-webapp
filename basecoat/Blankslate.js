/* rollup-tree-shake pure */

import React from 'react'
import classNames from 'classnames'

import { omit } from './util'

import './blankslate.scss'

export class Blankslate extends React.Component {
    getChildContext () {
        return {
            blankslate: true,
        }
    }

    render () {
        const {
            narrow,
            capped,
            spacious,
            large,
            nobackground,
            className,
        } = this.props

        const other = omit(this.props, [
            'narrow',
            'capped',
            'spacious',
            'large',
            'nobackground',
            'className',
        ])

        const classes = classNames('blankslate', {
            'blankslate-narrow': narrow,
            'blankslate-capped': capped,
            'blankslate-spacious': spacious,
            'blankslate-large': large,
            'blankslate-clean-background': nobackground,
        }, className)

        return <div className={classes} {...other}>{this.props.children}</div>
    }
}

Blankslate.childContextTypes = {
    blankslate: React.PropTypes.bool,
}
