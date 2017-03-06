
import React from 'react'
import { connect } from 'react-redux'
import { Input } from 'reactstrap'

import { fetchUsers } from '../actions/users'
import LinkButton from './LinkButton'
import FilterList from './FilterList'
import Pagination from './Pagination'

const PAGE = 1
const PER_PAGE = 10


class Users extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            filter: '',
        }
    }

    onChange (e) {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    componentDidMount () {
        this.props.fetchUsers()
    }

    render () {
        const users = this.props.users.filter(
            user => user.get('email').toUpperCase().indexOf(this.state.filter.toUpperCase()) !== -1
        ).entrySeq()

        return (
            <div>
                <div className="d-flex" style={{ marginBottom: 15 }}>
                    <Input
                        value={this.state.filter}
                        name="filter"
                        placeholder="Filter..."
                        onChange={e => this.onChange(e)}
                        style={{ marginRight: 15 }}
                    />
                    <LinkButton
                        color="primary"
                        href="/app/users/new"
                        className="ml-auto"
                    >New User</LinkButton>
                </div>
                <FilterList
                    items={users}
                    title={user => user.get('email') || '-'}
                    href={user => `/app/users/${user.get('id')}`}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(Users)
