
import React from 'react'
import { Route } from 'react-router-dom'

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
}]

const SideMenu = props => (
    <nav className="nav nav-pills flex-column">
        {links.map(route => (
            <Route
                key={route.path}
                path={route.path}
                children={routeProps => (
                    <a
                        className={routeProps.match ? 'nav-link active' : 'nav-link'}
                        href={route.path}
                        onClick={e => {
                            e.preventDefault()
                            props.push(e.target.getAttribute('href'))
                        }}
                    >
                        {route.title}
                    </a>
                )}
            />
        ))}
    </nav>
)

export default SideMenu
