
import React from 'react'
import { connect } from 'react-redux'
import { Button, Table } from 'reactstrap'

import LinkButton from '../LinkButton'
import { fetchContacts } from '../../actions/contacts'


class SiteContacts extends React.Component {
    componentDidMount () {
        this.props.fetchContacts({ site_id: this.props.site.get('id') })
    }

    render () {
        const contacts = this.props.contacts
            .filter(contact => contact.get('site_id') === this.props.site.get('id'))
            .sort((a, b) => a.get('id') - b.get('id'))
            .entrySeq()

        return (
            <div>
                <div className="d-flex flex-row">
                    <h4>Contacts</h4>
                    <LinkButton
                        href={`/app/sites/${this.props.site.get('id')}/contacts/new`}
                        color="primary"
                        className="ml-auto"
                    >New Contact</LinkButton>
                </div>
                <Table size="sm" style={{ marginTop: 30, marginBottom: 60 }}>
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Contact</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map(([id, contact]) => (
                            <tr key={id}>
                                <td>{contact.get('title')}</td>
                                <td>{contact.get('contact')}</td>
                                <td>{contact.get('email')}</td>
                                <td>{contact.get('phone')}</td>
                                <td>{contact.get('type')}</td>
                                <td>
                                    <Button size="sm">View</Button>
                                    <Button size="sm">Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        )
    }
}

const mapStateToProps = store => ({
    contacts: store.get('contacts'),
})

const mapDispatchToProps = dispatch => ({
    fetchContacts: filters => dispatch(fetchContacts(filters)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SiteContacts)
