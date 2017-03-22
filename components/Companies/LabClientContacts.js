
import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { Table, Badge } from 'reactstrap'

import { fetchUsers } from '../../actions/users'
import { fetchCompany } from '../../actions/companies'

class LabClientContacts extends React.Component {
    constructor (props) {
        super(props)

        const users = Immutable.List(props.company.get('user_ids').map(id => props.users.get(id)))

        this.state = {
            users,
        }
    }

    componentDidMount () {
        this.props.fetchCompany(this.props.company.get('id'))
        this.props.fetchUsers()
    }

    componentWillReceiveProps (nextProps) {
        const users = Immutable.List(nextProps.company.get('user_ids').map(id => nextProps.users.get(id)))

        this.setState({
            users,
        })
    }

    render () {
        return (

            <Table size="sm" style={{ marginTop: 30, marginBottom: 60 }}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.users.map(user => {
                        return user ? (
                            <tr key={user.get('id')}>
                                <td>{user.get('name') || '-'}</td>
                                <td>{user.get('email')}</td>
                                <td>{user.get('active') ? (
                                    <Badge color="success">Active</Badge>
                                ) : (
                                    <Badge>Pending</Badge>
                                )}</td>
                            </tr>
                        ) : null
                    })}
                </tbody>
            </Table>
        )
    }
}

const mapStateToProps = store => ({
    users: store.get('users'),
})

const mapDispatchToProps = dispatch => ({
    fetchUsers: () => dispatch(fetchUsers()),
    fetchCompany: id => dispatch(fetchCompany(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LabClientContacts)
