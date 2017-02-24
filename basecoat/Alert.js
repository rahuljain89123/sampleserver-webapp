/* rollup-tree-shake pure */

import React from 'react'
import classNames from 'classnames'

import { omit } from './util'
import { X } from './Octicon'

// import './alert.scss'

const Dismiss = () => (
    <button className="flash-close"><X /></button>
)

export class Flash extends React.Component {
    getChildContext () {
        return {
            flashaction: true,
        }
    }

    render () {
        const {
            warn,
            error,
            success,
            full,
            dismissable,
            className,
        } = this.props

        const other = omit(this.props, [
            'warn',
            'error',
            'success',
            'dismissable',
            'className',
        ])

        const classes = classNames('flash', {
            'flash-warn': warn,
            'flash-error': error,
            'flash-success': success,
            'flash-full': full,
        }, className)

        const newChildren = dismissable ? (
            [<Dismiss />].concat(React.Children.toArray(this.props.children))
        ) : this.props.children

        return (
            <div className={classes} {...other}>
                {newChildren}
            </div>
        )
    }
}

Flash.childContextTypes = {
    flashaction: React.PropTypes.bool,
}
