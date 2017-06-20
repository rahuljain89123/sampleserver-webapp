
import React from 'react'
import { connect } from 'react-redux'
import { Input } from 'reactstrap'

import { fetchClients } from '../../actions/clients'
import LinkButton from 'SharedComponents/LinkButton'
import FilterList from '../FilterList'


class Clients extends React.Component {
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
        this.props.fetchClients()
    }

    render () {
        const clients = this.props.clients
            .filter(
                client => (
                    client ?
                    client.get('name')
                        .toUpperCase()
                        .indexOf(this.state.filter.toUpperCase()) !== -1
                    : false
                )
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
                        style={{ marginRight: 15 }}
                    />
                    <LinkButton
                        color="primary"
                        href="/app/clients/new"
                        className="ml-auto"
                    >New Client</LinkButton>
                </div>
                <FilterList
                    items={clients}
                    title={client => client.get('name') || '-'}
                    href={client => `/app/clients/${client.get('id')}`}
                />
            </div>
        )
    }
}

const mapStateToProps = store => ({
    clients: store.get('clients'),
})

const mapDispatchToProps = dispatch => ({
    fetchClients: () => dispatch(fetchClients()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Clients)
