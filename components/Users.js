
import React from 'react'
import { connect } from 'react-redux'

import { TextField } from '../basecoat/Form'
import { Button } from '../basecoat/Button'

import { fetchUsers } from '../actions/users'
import FilterList from './FilterList'
import Pagination from './Pagination'

const PAGE = 1
const PER_PAGE = 10


class Users extends React.Component {
    componentDidMount () {
        this.props.fetchUsers()
    }

    render () {
        const users = this.props.users.slice(((PAGE - 1) * PER_PAGE), PER_PAGE).entrySeq()

        return (
            <div>
                <div className="clearfix" style={{ marginBottom: 10 }}>
                    <TextField
                        placeholder="Filter..."
                        className="float-left"
                        style={{ width: 500 }}
                    />
                    <Button
                        primary
                        link
                        href="/app/users/new"
                        className="float-right"
                    >New User</Button>
                </div>
                <FilterList
                    items={users}
                    title={user => user.get('email') || '-'}
                    href={user => `/app/users/${user.get('id')}`}
                />
                {users && users.size === PER_PAGE && <Pagination />}
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
