
import React from 'react'
import { connect } from 'react-redux'

import { fetchLab } from '../actions/labs'

class Lab extends React.Component {
    componentDidMount () {
        if (!this.props.labs.get(this.props.match.params.id)) {
            this.props.fetchLab(this.props.match.params.id)
        }
    }

    render () {
        const lab = this.props.labs.get(parseInt(this.props.match.params.id, 10))

        if (!lab) {
            return null
        }

        return (
            <div>
                <h3>{lab.get('title')}</h3>
                <strong>Address: </strong><span>{lab.get('address')}</span><br />
                <strong>City: </strong><span>{lab.get('city')}</span><br />
                <strong>State: </strong><span>{lab.get('state')}</span><br />
                <strong>Zip: </strong><span>{lab.get('zip')}</span><br />
                <strong>Phone: </strong><span>{lab.get('phone')}</span><br />
                <strong>Contact: </strong><span>{lab.get('contact')}</span><br />
                <strong>Cell: </strong><span>{lab.get('cell')}</span><br />
                <strong>Fax: </strong><span>{lab.get('fax')}</span><br />
                <strong>Email: </strong><span>{lab.get('email')}</span><br />
                <strong>Notes: </strong><span>{lab.get('notes')}</span><br />
                <strong>Shipping Company: </strong><span>{lab.get('shipping_company')}</span><br />
                <strong>Shipping Account: </strong><span>{lab.get('shipping_account')}</span><br />
                <strong>Shipping Notes: </strong><span>{lab.get('shipping_notes')}</span><br />
            </div>
        )
    }
}

const mapStateToProps = store => ({
    labs: store.get('labs'),
})

const mapDispatchToProps = dispatch => ({
    fetchLab: id => dispatch(fetchLab(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Lab)
