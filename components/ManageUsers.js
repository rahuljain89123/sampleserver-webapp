
import React from 'react'
import { connect } from 'react-redux'

import { Button } from '../basecoat/Button'
import {
    TabNav,
    Tabs,
    Tab,
} from '../basecoat/Navigation'
import {
    Form,
    InputGroup,
    TextField,
} from '../basecoat/Form'
import { State } from '../basecoat/State'
import { DataTable } from '../basecoat/Table'

import { fetchUsers } from '../actions/users'

const tabStyle = {
    cursor: 'pointer',
}

class ManageUsers extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            selectedTab: 'lab_admins',
            inviteEmail: '',
            invitees: [],
        }
    }

    onClick (e) {
        this.setState({
            selectedTab: e.target.name,
        })
    }

    onChangeEmail (e) {
        this.setState({
            inviteEmail: e.target.value,
        })
    }

    onInvite () {
        this.setState({
            invitees: [this.state.inviteEmail],
            inviteEmail: '',
        })
    }

    onSubmitInvite (e) {
        e.preventDefault()
        this.setState({
            invitees: [this.state.inviteEmail],
            inviteEmail: '',
        })
    }

    componentDidMount () {
        this.props.fetchUsers()
    }

    render () {
        return (
            <div>
                <div className="clearfix">
                    <h3 className="float-left">Manage CSI Labs, Inc. Users</h3>
                    <Button
                        link
                        href="/app/labs/1"
                        className="float-right"
                    >Back</Button>
                </div>
                <br />
                <TabNav>
                    <Tabs>
                        <Tab
                            selected={this.state.selectedTab === 'lab_admins'}
                            name="lab_admins"
                            onClick={e => this.onClick(e)}
                            style={tabStyle}
                        >
                            Lab Admins
                        </Tab>
                        <Tab
                            selected={this.state.selectedTab === 'lab_associates'}
                            name="lab_associates"
                            onClick={e => this.onClick(e)}
                            style={tabStyle}
                        >
                            Lab Associates
                        </Tab>
                        <Tab
                            selected={this.state.selectedTab === 'company_admins'}
                            name="company_admins"
                            onClick={e => this.onClick(e)}
                            style={tabStyle}
                        >
                            Company Admins
                        </Tab>
                        <Tab
                            selected={this.state.selectedTab === 'company_associates'}
                            name="company_associates"
                            onClick={e => this.onClick(e)}
                            style={tabStyle}
                        >
                            Company Associates
                        </Tab>
                        <Tab
                            selected={this.state.selectedTab === 'project_managers'}
                            name="project_managers"
                            onClick={e => this.onClick(e)}
                            style={tabStyle}
                        >
                            Project Managers
                        </Tab>
                    </Tabs>
                </TabNav>
                <div style={{ display: this.state.selectedTab === 'lab_admins' ? 'block' : 'none' }}>
                    Can view/edit all sites created and managed under this Lab.<br />
                    Can create and disable Lab Associates.<br /><br />

                    <DataTable>
                        <thead>
                            <tr>
                                <th><strong>User</strong></th>
                                <th><strong>Status</strong></th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>nicholas.woodhams@gmail.com</td>
                                <td><State open>Active</State></td>
                                <td><Button sm className="float-right">Remove</Button></td>
                            </tr>
                            {this.state.invitees.map(invitee => (
                                <tr key={invitee}>
                                    <td>{invitee}</td>
                                    <td><State merged>Pending</State></td>
                                    <td><Button sm className="float-right">Remove</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </DataTable>
                    <br />
                    <Form onSubmit={e => this.onSubmitInvite(e)}>
                        <strong>Invite Lab Admin</strong><br /><br />
                        <InputGroup style={{ width: 300 }}>
                            <TextField
                                placeholder="name@example.com"
                                value={this.state.inviteEmail}
                                onChange={e => this.onChangeEmail(e)}
                            />
                            <Button onClick={() => this.onInvite()}>Invite</Button>
                        </InputGroup>
                    </Form>
                </div>
                <div style={{ display: this.state.selectedTab === 'lab_associates' ? 'block' : 'none' }}>
                    Can receive samples.<br />
                    Can create new sites and enter data.<br />
                    Cant delete sites/accounts or access billing info.<br /><br />
                    <Form>
                        <strong>Invite Lab Associate</strong><br /><br />
                        <InputGroup style={{ width: 300 }}>
                            <TextField placeholder="name@example.com" />
                            <Button>Invite</Button>
                        </InputGroup>
                    </Form>
                </div>
                <div style={{ display: this.state.selectedTab === 'company_admins' ? 'block' : 'none' }}>
                    Can create additional CompanyAdmin Users.<br />
                    CompanyAdmin users can disable other CompanyAdmin users.<br />
                    CompanyAdmin cannot disable himself.<br />
                    All CompanyAdmins receive notification the invoice, and all have the ability to pay.<br />
                    Also have CompanyAssociate permissions.<br /><br />
                    <Form>
                        <strong>Invite Company Admin</strong><br /><br />
                        <InputGroup style={{ width: 300 }}>
                            <TextField placeholder="name@example.com" />
                            <Button>Invite</Button>
                        </InputGroup>
                    </Form>
                </div>
                <div style={{ display: this.state.selectedTab === 'company_associates' ? 'block' : 'none' }}>
                    Can create/edit/view all sites within the company.<br />
                    Can create site groups.<br />
                    Can add project managers and technicians to each site group.<br /><br />
                    <Form>
                        <strong>Invite Company Associate</strong><br /><br />
                        <InputGroup style={{ width: 300 }}>
                            <TextField placeholder="name@example.com" />
                            <Button>Invite</Button>
                        </InputGroup>
                    </Form>
                </div>
                <div style={{ display: this.state.selectedTab === 'project_managers' ? 'block' : 'none' }}>
                    Is assigned by CompanyAdmin or CompanyAssociate only.<br />
                    Can create/edit/view sites within assigned group of sites but cannot delete.<br />
                    Can assign Technicians on a site-by-site basis only.<br /><br />
                    <Form>
                        <strong>Invite Project Manager</strong><br /><br />
                        <InputGroup style={{ width: 300 }}>
                            <TextField placeholder="name@example.com" />
                            <Button>Invite</Button>
                        </InputGroup>
                    </Form>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageUsers)
