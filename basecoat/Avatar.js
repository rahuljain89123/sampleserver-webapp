/* rollup-tree-shake pure */

import React from 'react'
import classNames from 'classnames'

import { omit } from './util'

// import './avatar.scss'

export const Avatar = (props, context) => {
    const {
        width,
        height,
        src,
        alt,
        sm,
        parent,
        className,
    } = props

    const other = omit(props, [
        'width',
        'height',
        'src',
        'alt',
        'sm',
        'parent',
        'className',
    ])

    const defaultWidth = width || 72
    const defaultHeight = height || 72

    if (props.children) {
        return (
            <ParentChild width={defaultWidth} height={defaultHeight}>
                <Avatar src={src} width={defaultWidth} height={defaultHeight} parent />
                {props.children}
            </ParentChild>
        )
    }

    const isChild = !parent && context.parentchild
    const classes = classNames('avatar', {
        'avatar-sm': sm,
        'avatar-child': isChild,
    }, className)

    return (
        <img
            className={classes}
            src={src}
            alt={alt || ''}
            width={defaultWidth}
            height={defaultHeight}
            {...other}
        />
    )
}

Avatar.contextTypes = {
    parentchild: React.PropTypes.bool,
}

class ParentChild extends React.Component {
    getChildContext () {
        return {
            parentchild: true,
        }
    }

    render () {
        return (
            <div className="avatar-parent-child" style={{ width: this.props.width }}>
                {this.props.children}
            </div>
        )
    }
}

ParentChild.childContextTypes = {
    parentchild: React.PropTypes.bool,
}

export class CircleBadge extends React.Component {
    getChildContext () {
        return {
            circlebadge: true,
        }
    }

    render () {
        const {
            sm,
            med,
            large,
            src,
            className,
        } = this.props

        const other = omit(this.props, [
            'sm',
            'med',
            'large',
            'src',
            'className',
        ])

        const classes = classNames('CircleBadge', {
            'CircleBadge--small': sm || !(sm || med || large),
            'CircleBadge--medium': med,
            'CircleBadge--large': large,
        }, className)

        const inner = (src && !this.props.children) ? (
            <img src={src} className="CircleBadge-icon" alt="" />
        ) : this.props.children

        if (this.context.dashedconnection) {
            return <li className={classes} {...other}>{inner}</li>
        }

        return <a className={classes} {...other}>{inner}</a>
    }
}

CircleBadge.childContextTypes = {
    circlebadge: React.PropTypes.bool,
}

CircleBadge.contextTypes = {
    dashedconnection: React.PropTypes.bool,
}

export class DashedConnection extends React.Component {
    getChildContext () {
        return {
            dashedconnection: true,
        }
    }

    render () {
        const { className } = this.props
        const other = omit(this.props, ['className'])
        const classes = classNames('DashedConnection', className)

        return (
            <div className={classes} {...other}>
                <ul className="d-flex list-style-none flex-justify-between">
                    {this.props.children}
                </ul>
            </div>
        )
    }
}

DashedConnection.childContextTypes = {
    dashedconnection: React.PropTypes.bool,
}
