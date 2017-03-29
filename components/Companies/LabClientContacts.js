
import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'

import { fetchUsers } from '../../actions/users'
import { fetchCompany } from '../../actions/companies'
import UserList from './UserList'
import LabContactForm from './LabContactForm'


class LabClientContacts extends React.Component {
    constructor (props) {
        super(props)

        const users = Immutable.List(props.company.get('user_ids').map(id => props.users.get(id)))
        const primaryUser = users.first()

        this.state = {
            users,
            primaryUser,
        }
    }

    componentDidMount () {
        this.props.fetchCompany(this.props.company.get('id'))
        this.props.fetchUsers({ companies: this.props.company.get('id') })
    }

    componentWillReceiveProps (nextProps) {
        const users = Immutable.List(nextProps.company.get('user_ids').map(id => nextProps.users.get(id)))
        const primaryUser = users.first()

        this.setState({
            users,
            primaryUser,
        })
    }

    render () {
        if (this.state.primaryUser && this.state.primaryUser.get('active')) {
            return <UserList users={this.state.users} />
        }
        if (this.state.primaryUser) {
            return <LabContactForm user={this.state.primaryUser} companyId={this.props.company.get('id')} />
        }
        return null
    }
}


const mapStateToProps = store => ({
    users: store.get('users'),
})

const mapDispatchToProps = dispatch => ({
    fetchUsers: filters => dispatch(fetchUsers(filters)),
    fetchCompany: id => dispatch(fetchCompany(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LabClientContacts)
