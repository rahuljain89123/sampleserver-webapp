/* rollup-tree-shake pure */

import React from 'react'
import classNames from 'classnames'
import uniqueId from 'lodash/uniqueId'

import { omit } from './util'

// import './form.scss'

export const Form = props => (
    <form {...props}>
        {props.children}
    </form>
)

export class FormGroup extends React.Component {
    getChildContext () {
        return {
            formgroup: true,
        }
    }

    render () {
        const {
            error,
            warning,
            children,
            className,
        } = this.props

        const other = omit(this.props, [
            'error',
            'warning',
            'className',
        ])

        const hasErrors = React.Children.toArray(children)
            .some(child => child.props && !!child.props.error)

        const hasWarnings = React.Children.toArray(children)
            .some(child => child.props && !!child.props.warning)

        const classes = classNames('form-group', {
            'errored': error || hasErrors,
            'warn': warning || hasWarnings,
        }, className)

        return <dl className={classes} {...other}>{children}</dl>
    }
}

FormGroup.childContextTypes = {
    formgroup: React.PropTypes.bool,
}

export class TextField extends React.Component {
    constructor (props) {
        super(props)

        this.id = uniqueId('basecoat_')
    }

    render () {
        const {
            type,
            label,
            error,
            warning,
            contrast,
            sm,
            large,
            block,
            placeholder,
            className,
        } = this.props

        const other = omit(this.props, [
            'type',
            'label',
            'error',
            'warning',
            'contrast',
            'sm',
            'large',
            'block',
            'placeholder',
            'className',
        ])

        const classes = classNames('form-control', {
            'input-contrast': contrast,
            'input-sm': sm,
            'input-lg': large,
            'input-block': block,
        }, className)

        const input = (
            <input
                className={classes}
                type={type || 'text'}
                id={this.id}
                placeholder={placeholder}
                {...other}
            />
        )

        if (label) {
            const inputLabel = <label htmlFor={this.id}>{label}</label>

            if (this.context.formgroup) {
                return (
                    <span>
                        <dt>{inputLabel}</dt>
                        <dd>{input}</dd>
                        { (!!error) && <dd className="error">{error}</dd> }
                        { (!!warning) && <dd className="warning">{warning}</dd> }
                    </span>
                )
            }

            return <span>{inputLabel}{input}</span>
        }

        if (this.context.formgroup) {
            if (error || warning) {
                return (
                    <span>
                        <dd>{input}</dd>
                        { (!!error) && <dd className="error">{error}</dd>}
                        { (!!warning) && <dd className="warning">{warning}</dd>}
                    </span>
                )
            }

            return <dd>{input}</dd>
        }

        return input
    }
}

TextField.contextTypes = {
    formgroup: React.PropTypes.bool,
}

export class Checkbox extends React.Component {
    constructor (props) {
        super(props)

        this.id = uniqueId('basecoat_')
    }

    render () {
        const {
            label,
            note,
        } = this.props

        const other = omit(this.props, [
            'label',
            'note',
        ])

        const highlighted = (
            label &&
            label.props &&
            label.props.className.indexOf('highlight') !== -1
        )

        const input = <input type="checkbox" id={this.id} {...other} />

        const inputLabel = label ? (
            <label htmlFor={this.id}>
                {input}{label}
            </label>
        ) : input

        return (note || highlighted) ? (
            <div className="form-checkbox">
                {inputLabel}
                { (!!note) && <p className="note">{note}</p> }
            </div>
        ) : inputLabel
    }
}

export class RadioButtonGroup extends React.Component {
    render () {
        if (React.Children.count(this.props.children) > 1) {
            return (
                <span>
                    {this.props.children}
                </span>
            )
        }

        return this.props.children
    }
}

export class RadioButton extends React.Component {
    constructor (props) {
        super(props)

        this.id = uniqueId('basecoat_')
    }

    render () {
        const {
            label,
            note,
        } = this.props

        const other = omit(this.props, [
            'label',
            'note',
        ])

        const highlighted = label.props && label.props.className

        const input = <input type={'radio'} id={this.id} {...other} />
        const inputLabel = label ? (
            <label htmlFor={this.id}>
                {input}{label}
            </label>
        ) : input

        return (note || highlighted) ? (
            <div className="form-checkbox">
                {inputLabel}
                { (!!note) && <p className="note">{note}</p> }
            </div>
        ) : inputLabel
    }
}

export class Select extends React.Component {
    constructor (props) {
        super(props)

        this.id = uniqueId('basecoat_')
    }

    render () {
        const {
            sm,
            label,
            className,
        } = this.props

        const other = omit(this.props, [
            'sm',
            'label',
            'className',
        ])

        const classes = classNames('form-select', {
            'select-sm': sm,
        }, className)

        const input = (
            <select className={classes} id={this.id} {...other}>
                {this.props.children}
            </select>
        )

        if (label) {
            const inputLabel = <label htmlFor={this.id}>{label}</label>

            if (this.context.formgroup) {
                return <span><dt>{inputLabel}</dt><dd>{input}</dd></span>
            }

            return <span>{inputLabel}{input}</span>
        }

        if (this.context.formgroup) {
            return <dd>{input}</dd>
        }

        return input
    }
}

Select.contextTypes = {
    formgroup: React.PropTypes.bool,
}

export const Option = props => (
    <option {...props}>
        {props.children}
    </option>
)

export class TextArea extends React.Component {
    constructor (props) {
        super(props)

        this.id = uniqueId('basecoat_')
    }

    render () {
        const {
            label,
            className,
        } = this.props

        const other = omit(this.props, [
            'label',
            'className',
        ])

        const classes = classNames('form-control', className)

        const input = <textarea className={classes} id={this.id} {...other} />

        if (label) {
            const inputLabel = <label htmlFor={this.id}>{label}</label>

            if (this.context.formgroup) {
                return <span><dt>{inputLabel}</dt><dd>{input}</dd></span>
            }

            return <span>{inputLabel}{input}</span>
        }

        if (this.context.formgroup) {
            return <dd>{input}</dd>
        }

        return input
    }
}

TextArea.contextTypes = {
    formgroup: React.PropTypes.bool,
}

export class InputGroup extends React.Component {
    getChildContext () {
        return {
            inputgroup: true,
        }
    }

    render () {
        const { className } = this.props
        const other = omit(this.props, ['className'])
        const classes = classNames('input-group', className)

        return (
            <div className={classes} {...other}>
                {this.props.children}
            </div>
        )
    }
}

InputGroup.childContextTypes = {
    inputgroup: React.PropTypes.bool,
}
