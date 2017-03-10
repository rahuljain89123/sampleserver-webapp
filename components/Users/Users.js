
import React from 'react'
import { connect } from 'react-redux'
import { Input } from 'reactstrap'

import { fetchUsers } from '../../actions/users'
import FilterList from '../FilterList'


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
        const users = this.props.users
            .filter(
                user =>
                    user.get('email')
                        .toUpperCase()
                        .indexOf(this.state.filter.toUpperCase()) !== -1
            )
            .sort((a, b) => a.get('id') - b.get('id'))
            .entrySeq()

        return (
            <div>
                <div className="d-flex" style={{ marginBottom: 15 }}>
                    <Input
                        value={this.state.filter}
                        name="filter"
                        placeholder="Filter..."
                        onChange={e => this.onChange(e)}
                    />
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
