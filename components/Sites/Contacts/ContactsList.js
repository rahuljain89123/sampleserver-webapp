
import React from 'react'
import { connect } from 'react-redux'
import { Button, Table } from 'reactstrap'
import { Link } from 'react-router-dom'

import LinkButton from 'SharedComponents/LinkButton'
import { fetchContacts } from 'actions/contacts'
import { flashMessage, setHeaderInfo } from 'actions/global'


class ContactsList extends React.Component {
    componentDidMount () {
      this.props.fetchContacts({ site_id: this.props.site.get('id') })
      this.props.setHeaderInfo('Contacts', [{
        text: 'New Contact',
        onClick: `/app/sites/${this.props.site.get('id')}/contacts/new`,
        iconName: 'add_circle_outline',
      }])
    }

    render () {
        const contacts = this.props.contacts
            .filter(contact => contact.get('site_id') === this.props.site.get('id'))
            .sort((a, b) => a.get('id') - b.get('id'))
            .entrySeq()

        let contactsTable = null

        if (contacts.size) {
            contactsTable = (
                <Table size="sm" style={{ marginTop: 30, marginBottom: 60 }}>
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Contact</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map(([id, contact]) => (
                            <tr
                                key={id}
                                className="pointer"
                                onClick={() => { this.props.push(`/app/sites/${this.props.site.get('id')}/contacts/${id}`) }}
                            >
                                <td>{contact.get('title')}</td>
                                <td>{contact.get('contact')}</td>
                                <td>{contact.get('email')}</td>
                                <td>{contact.get('phone')}</td>
                                <td>{contact.get('type')}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )
        } else {
            contactsTable = <p>No contacts yet. <Link to={`/app/sites/${this.props.site.get('id')}/contacts/new`}>Add Contact</Link></p>
        }

        return (
            <div>
                {contactsTable}
            </div>
        )
    }
}

const mapStateToProps = store => ({
  contacts: store.get('contacts'),
})

const mapDispatchToProps = dispatch => ({
  fetchContacts: filters => dispatch(fetchContacts(filters)),
  setHeaderInfo: (title, buttons) => dispatch(setHeaderInfo(title, buttons)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ContactsList)
