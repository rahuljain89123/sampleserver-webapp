
import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch, NavLink } from 'react-router-dom'
import {
  Breadcrumb,
  BreadcrumbItem,
  Nav,
  NavItem,
} from 'reactstrap'


import { fetchCompany } from '../../actions/companies'

import CompanyUploads from './CompanyUploads'
import CompanySettings from './CompanySettings'
import LabClientContacts from './LabClientContacts'


class LabClient extends React.Component {
  constructor (props) {
    super(props)

    const companyId = parseInt(props.match.params.id, 10)
    const company = props.companies.get(companyId)

    this.state = {
      companyId,
      company,
    }
  }

  componentDidMount () {
    if (!this.state.company) {
      this.props.fetchCompany(this.state.companyId)
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      company: nextProps.companies.get(this.state.companyId),
    })
  }

  onClick (e) {
    e.preventDefault()
    this.props.push(e.target.getAttribute('href'))
  }

  render () {
    const company = this.state.company

    if (!company) {
      return null
    }

    return (
      <div className="lab-client">
        <Nav tabs style={{ marginBottom: 30 }}>
          <NavItem>
            <NavLink
              exact
              to={`/app/clients/${company.get('id')}`}
              className="nav-link"
              activeClassName="active"
            >Contacts</NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              exact
              to={`/app/clients/${company.get('id')}/uploads`}
              className="nav-link"
              activeClassName="active"
            >Uploads</NavLink>
          </NavItem>
          {company.get('is_deletable') ? (
            <NavItem>
              <NavLink
                exact
                to={`/app/clients/${company.get('id')}/settings`}
                className="nav-link"
                activeClassName="active"
              >Settings</NavLink>
            </NavItem>
          ) : null}
        </Nav>

        <Switch>
          <Route
            exact
            path="/app/clients/:id"
            render={() => <LabClientContacts company={company} />}
          />
          <Route
            exact
            path="/app/clients/:id/uploads"
            render={() => (
              <CompanyUploads company={company} />
            )}
          />
          <Route
            exact
            path="/app/clients/:id/settings"
            render={props => (
              <CompanySettings company={company} {...props} />
            )}
          />
        </Switch>
      </div>
    )
  }
}

const mapStateToProps = store => ({
  companies: store.get('companies'),
})

const mapDispatchToProps = dispatch => ({
  fetchCompany: id => dispatch(fetchCompany(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LabClient)
