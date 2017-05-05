
import React from 'react'
import { connect } from 'react-redux'
import { Input } from 'reactstrap'

import { fetchSites } from '../../actions/sites'
import LinkButton from 'components/LinkButton'
import FilterList from '../FilterList'


class Sites extends React.Component {
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
        this.props.fetchSites()
    }

    render () {
        const sites = this.props.sites
            .filter(
                site => (
                    site ?
                    site.get('title')
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
                        href="/app/sites/new"
                        className="ml-auto"
                    >New Site</LinkButton>
                </div>
                <FilterList
                    items={sites}
                    title={site => site.get('title') || '-'}
                    href={site => `/app/sites/${site.get('id')}`}
                />
            </div>
        )
    }
}

const mapStateToProps = store => ({
    sites: store.get('sites').filter(site => site.get('title') !== ''),
})

const mapDispatchToProps = dispatch => ({
    fetchSites: () => dispatch(fetchSites()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Sites)
