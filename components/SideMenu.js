
import React from 'react'
import {
    Menu,
    MenuItem,
} from '../basecoat/Navigation'

const links = [{
    path: '/app/users',
    title: 'Users',
}, {
    path: '/app/labs',
    title: 'Labs',
}, {
    path: '/app/reports',
    title: 'Reports',
}, {
    path: '/app/samples',
    title: 'Samples',
}, {
    path: '/app/sitemaps',
    title: 'Sitemaps',
}, {
    path: '/app/sites',
    title: 'Sites',
}, {
    path: '/app/substances',
    title: 'Substances',
}, {
    path: '/app/tests',
    title: 'Tests',
}, {
    path: '/app/wells',
    title: 'Wells',
}]

const SideMenu = props => (
    <Menu>
        {links.map(route => (
            <MenuItem
                href={route.path}
                key={route.path}
                selected={props.match.path === route.path}
            >
                {route.title}
            </MenuItem>
        ))}
    </Menu>
)

export default SideMenu
