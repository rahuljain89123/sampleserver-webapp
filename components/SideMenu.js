
import React from 'react'
import { NavLink } from 'react-router-dom'

const SideMenu = () => (
    <nav className="nav nav-pills flex-column">
        <NavLink
            to="/app/users"
            className="nav-link"
            activeClassName="active"
        >Users</NavLink>
        <NavLink
            to="/app/labs"
            className="nav-link"
            activeClassName="active"
        >Labs</NavLink>
        <NavLink
            to="/app/companies"
            className="nav-link"
            activeClassName="active"
        >Companies</NavLink>
        <NavLink
            to="/app/projects"
            className="nav-link"
            activeClassName="active"
        >Projects</NavLink>
        <NavLink
            to="/app/sites"
            className="nav-link"
            activeClassName="active"
        >Sites</NavLink>
    </nav>
)

export default SideMenu
