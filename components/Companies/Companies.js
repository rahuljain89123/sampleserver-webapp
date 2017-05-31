
import React from 'react'
import { connect } from 'react-redux'
import { Input } from 'reactstrap'

import { fetchCompanies } from 'actions/companies'
import LinkButton from 'SharedComponents/LinkButton'
import FilterList from 'components/FilterList'


class Companies extends React.Component {
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
        this.props.fetchCompanies()
    }

    render () {
        const companies = this.props.companies
            .filter(
                company => (
                    company ?
                    company.get('title')
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
                        href="/app/companies/new"
                        className="ml-auto"
                    >New Company</LinkButton>
                </div>
                <FilterList
                    items={companies}
                    title={company => company.get('title') || '-'}
                    href={company => `/app/companies/${company.get('id')}`}
                />
            </div>
        )
    }
}

const mapStateToProps = store => ({
    companies: store.get('companies'),
})

const mapDispatchToProps = dispatch => ({
    fetchCompanies: () => dispatch(fetchCompanies()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Companies)
