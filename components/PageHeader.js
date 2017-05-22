
import React from 'react'
import { connect } from 'react-redux'
import {
  ListGroup,
  ListGroupItem,
  ButtonDropdown,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Navbar,
  Nav,
  NavItem,
} from 'reactstrap'
import { Route, Link, NavLink, Switch } from 'react-router-dom'
import PrivateRoute from './Auth'


class PageHeader extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    return (
      <div className="navbar-container">
        <Navbar className="d-flex flex-row justify-content-between">
          <div className="navbar-brand">{this.props.pageTitle}</div>
          {this.props.pageButtons}
        </Navbar>
      </div>
    )
  }
}

const mapStateToProps = store => ({
  roles: store.get('roles'),
  flash: store.get('flash'),
  sites: store.get('sites'),
})

export default connect(mapStateToProps)(PageHeader)
