/* rollup-tree-shake pure */

import React from 'react'
import classNames from 'classnames'

import { omit } from './util'

// import './button.scss'

export const Button = (props, context) => {
    const {
        link,
        sm,
        primary,
        danger,
        outline,
        disabled,
        selected,
        block,
        count,
        className,
    } = props

    const other = omit(props, [
        'link',
        'sm',
        'primary',
        'danger',
        'outline',
        'disabled',
        'selected',
        'block',
        'count',
        'className',
    ])

    const onClick = (
        props.href &&
        context &&
        context.router &&
        context.router.push
    ) ? e => {
        e.preventDefault()
        context.router.push(props.href)
    } : null

    if (count) {
        return (
            <div className="clearfix">
                <a className="btn btn-sm btn-with-count" role="button" {...other}>
                    {props.children}
                </a>
                <a className="social-count" {...other}>{count}</a>
            </div>
        )
    }

    const classes = classNames('btn', {
        'btn-sm': sm,
        'btn-primary': primary,
        'btn-danger': danger,
        'btn-outline': outline,
        'disabled': disabled,
        'selected': selected,
        'btn-block': block,
        'BtnGroup-item': context.buttongroup,
        'flash-action': context.flashaction,
    }, className)

    const button = link ? (
        <a className={classes} role="button" onClick={onClick} {...other}>
            {props.children}
        </a>
    ) : (
        <button className={classes} type="button" {...other}>
            {props.children}
        </button>
    )

    return context.inputgroup ? (
        <span className="input-group-button">
            {button}
        </span>
    ) : button
}

Button.contextTypes = {
    buttongroup: React.PropTypes.bool,
    flashaction: React.PropTypes.bool,
    inputgroup: React.PropTypes.bool,
    router: React.PropTypes.shape({
        push: React.PropTypes.func,
    }),
}

export class ButtonGroup extends React.Component {
    getChildContext () {
        return {
            buttongroup: true,
        }
    }

    render () {
        const { className } = this.props
        const other = omit(this.props, ['className'])
        const classes = classNames('BtnGroup', className)

        return (
            <div className={classes} {...other}>
                {this.props.children}
            </div>
        )
    }
}

ButtonGroup.childContextTypes = {
    buttongroup: React.PropTypes.bool,
}

export const HiddenText = props => {
    const { className } = props
    const other = omit(props, ['className'])
    const classes = classNames('hidden-text-expander', {
        'inline': props.inline,
    }, className)

    return (
        <span className={classes} {...other}>
            <button type="button" className="ellipsis-expander" aria-expanded="false">
                &hellip;
            </button>
        </span>
    )
}
