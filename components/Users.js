
import React from 'react'
import { connect } from 'react-redux'

import { TextField } from '../basecoat/Form'

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
            user => user.get('email').indexOf(this.state.filter) !== -1
        ).entrySeq()

        return (
            <div>
                <div className="clearfix" style={{ marginBottom: 10 }}>
                    <TextField
                        value={this.state.filter}
                        name="filter"
                        placeholder="Filter..."
                        className="float-left"
                        style={{ width: 500 }}
                        onChange={e => this.onChange(e)}
                    />
                    <LinkButton
                        color="primary"
                        href="/app/users/new"
                        className="float-right"
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
