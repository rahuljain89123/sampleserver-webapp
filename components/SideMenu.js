
import React from 'react'
import { ListGroup, ListGroupItem } from 'reactstrap'

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
    <nav class="nav flex-column">
        {links.map(route => (
            <a
                className="nav-link"
                key={route.path}
                href={route.path}
                onClick={e => {
                    e.preventDefault()
                    props.push(e.target.getAttribute('href'))
                }}
            >
                {route.title}
            </a>
        ))}
    </nav>
)

export default SideMenu
