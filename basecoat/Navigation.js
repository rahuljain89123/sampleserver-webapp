/* rollup-tree-shake pure */

import React from 'react'
import classNames from 'classnames'

import { Search } from './Octicon'
import { omit } from './util'

import './navigation.scss'

export class Menu extends React.Component {
    getChildContext () {
        return {
            menu: true,
        }
    }

    render () {
        const { className } = this.props
        const other = omit(this.props, ['className'])
        const classes = classNames('menu', className)

        return <nav className={classes} {...other}>{this.props.children}</nav>
    }
}

Menu.childContextTypes = {
    menu: React.PropTypes.bool,
}

export class Submenu extends React.Component {
    getChildContext () {
        return {
            submenu: true,
        }
    }

    render () {
        const { className } = this.props
        const other = omit(this.props, ['className'])
        const classes = classNames('subnav', className)

        return <nav className={classes} {...other}>{this.props.children}</nav>
    }
}

Submenu.childContextTypes = {
    submenu: React.PropTypes.bool,
}

export const MenuItem = (props, context) => {
    const {
        selected,
        className,
    } = props

    const other = omit(props, [
        'selected',
        'className',
    ])

    const onClick = (
        props.href &&
        context.router &&
        context.router.push
    ) ? e => {
        e.preventDefault()
        context.router.push(props.href)
    } : null

    const baseclass = (context.menu && !context.submenu) ? 'menu-item' : 'subnav-item'
    const classes = classNames(baseclass, {
        'selected': selected,
    }, className)

    return <a className={classes} onClick={onClick} {...other}>{props.children}</a>
}

MenuItem.contextTypes = {
    menu: React.PropTypes.bool,
    submenu: React.PropTypes.bool,
    router: React.PropTypes.shape({
        push: React.PropTypes.func,
    }),
}

export const SubmenuSearch = props => {
    const { className } = props
    const other = omit(props, ['className'])
    const classes = classNames('form-control', 'subnav-search-input', className)

    return (
        <div className="subnav-search float-left">
            <input type="search" className={classes} {...other} />
            <Search className="subnav-search-icon" />
        </div>
    )
}

export const MenuHeading = props => {
    const { className } = props
    const other = omit(props, ['className'])
    const classes = classNames('menu-heading', className)

    return <span className={classes} {...other}>{props.children}</span>
}

export const TabNav = props => {
    const { className } = props
    const other = omit(props, ['className'])
    const classes = classNames('tabnav', className)

    return <div className={classes} {...other}>{props.children}</div>
}

export const Tabs = props => {
    const { className } = props
    const other = omit(props, ['className'])
    const classes = classNames('tabnav-tabs', className)

    return <nav className={classes} {...other}>{props.children}</nav>
}

export const Tab = props => {
    const {
        selected,
        className,
    } = props

    const other = omit(props, [
        'selected',
        'className',
    ])

    const classes = classNames('tabnav-tab', {
        'selected': selected,
    }, className)

    return <a className={classes} {...other}>{props.children}</a>
}

export const Filter = props => {
    const { className } = props
    const other = omit(props, ['className'])
    const classes = classNames('filter-list', className)

    return <ul className={classes} {...other}>{props.children}</ul>
}

export const FilterItem = (props, context) => {
    const {
        selected,
        className,
    } = props

    const other = omit(props, [
        'selected',
        'className',
    ])

    const onClick = (
        props.href &&
        context.router &&
        context.router.push
    ) ? e => {
        e.preventDefault()
        context.router.push(props.href)
    } : null

    const classes = classNames('filter-item', {
        'selected': selected,
    }, className)

    return <li><a className={classes} onClick={onClick} {...other}>{props.children}</a></li>
}

FilterItem.contextTypes = {
    router: React.PropTypes.shape({
        push: React.PropTypes.func,
    }),
}
