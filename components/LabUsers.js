
import React from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap'


import { fetchUsers } from '../actions/users'

const tabStyle = {
    cursor: 'pointer',
}

class LabUsers extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            activeTab: '1'
        }
    }

    onToggle (tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
            })
        }
    }

    componentDidMount () {
        this.props.fetchUsers()
    }

    render () {
        return (
            <div>
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: this.state.activeTab === '1' })}
                      onClick={() => this.onToggle('1')}
                    >
                      Lab Admins
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: this.state.activeTab === '2' })}
                      onClick={() => this.onToggle('2')}
                    >
                      Lab Associates
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: this.state.activeTab === '3' })}
                      onClick={() => this.onToggle('3')}
                    >
                      Company Admins
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: this.state.activeTab === '4' })}
                      onClick={() => this.onToggle('4')}
                    >
                      Company Associates
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: this.state.activeTab === '5' })}
                      onClick={() => this.onToggle('5')}
                    >
                      Project Managers
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab} style={{ marginTop: 20 }}>
                  <TabPane tabId="1">
                    <Row>
                      <Col sm="12">
                        <p>
                            Can view/edit all sites created and managed under this Lab.<br />
                            Can create and disable Lab Associates.<br /><br />
                        </p>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="2">
                    <Row>
                      <Col sm="12">
                        <p>
                            Can receive samples.<br />
                            Can create new sites and enter data.<br />
                            Cant delete sites/accounts or access billing info.<br /><br />
                        </p>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="3">
                    <Row>
                      <Col sm="12">
                        <p>
                            Can create additional CompanyAdmin Users.<br />
                            CompanyAdmin users can disable other CompanyAdmin users.<br />
                            CompanyAdmin cannot disable himself.<br />
                            All CompanyAdmins receive notification the invoice, and all have the ability to pay.<br />
                            Also have CompanyAssociate permissions.<br /><br />
                        </p>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="4">
                    <Row>
                      <Col sm="12">
                        <p>
                            Can create/edit/view all sites within the company.<br />
                            Can create site groups.<br />
                            Can add project managers and technicians to each site group.<br /><br />
                        </p>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="5">
                    <Row>
                      <Col sm="12">
                        <p>
                            Is assigned by CompanyAdmin or CompanyAssociate only.<br />
                            Can create/edit/view sites within assigned group of sites but cannot delete.<br />
                            Can assign Technicians on a site-by-site basis only.<br /><br />
                        </p>
                      </Col>
                    </Row>
                  </TabPane>
              </TabContent>
            </div>
        )
    }
}

const mapStateToProps = store => ({
    users: store.get('users'),
})

const mapDispatchToProps = dispatch => ({
    fetchUsers: () => dispatch(fetchUsers()),
})

export default connect(mapStateToProps, mapDispatchToProps)(LabUsers)
