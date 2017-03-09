
import React from 'react'
import { ListGroup, ListGroupItem } from 'reactstrap'

const links = [{
    path: '/app/users',
    title: 'Users',
}, {
    path: '/app/labs',
    title: 'Labs',
}, {
    path: '/app/companies',
    title: 'Companies',
}, {
    path: '/app/projects',
    title: 'Projects',
}, {
    path: '/app/sites',
    title: 'Sites',
}, {
    path: '/app/samples',
    title: 'Samples',
}]

const SideMenu = props => (
    <nav className="nav flex-column">
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
