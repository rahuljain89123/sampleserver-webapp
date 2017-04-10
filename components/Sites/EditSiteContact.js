
import React from 'react'
import { connect } from 'react-redux'
import {
    Row,
    Col,
    Button,
} from 'reactstrap'

import { fetchContact, deleteContact } from '../../actions/contacts'
import EditSiteContactForm from './EditSiteContactForm'


class EditSiteContact extends React.Component {
    constructor (props) {
        super(props)

        const contactId = parseInt(props.match.params.id, 10)

        this.state = {
            contactId,
        }
    }

    componentDidMount () {
        this.props.fetchContact(this.state.contactId)
    }

    onDelete () {
        this.props.deleteContact(this.state.contactId)
            .then(() => this.props.onSuccess())
    }

    render () {
        const contact = this.props.contacts.get(this.state.contactId)

        if (!contact) {
            return null
        }

        return (
            <Row>
                <Col sm={6}>
                    <div className="d-flex">
                        <h4>Edit Contact</h4>
                        <Button
                            onClick={() => this.onDelete()}
                            className="ml-auto"
                            role="button"
                            color="danger"
                        >Delete Contact</Button>
                    </div>
                    <EditSiteContactForm
                        site={this.props.site}
                        contact={contact}
                        onSuccess={this.props.onSuccess}
                    />
                </Col>
            </Row>
        )
    }
}

const mapStateToProps = store => ({
    contacts: store.get('contacts'),
})

const mapDispatchToProps = dispatch => ({
    fetchContact: id => dispatch(fetchContact(id)),
    deleteContact: id => dispatch(deleteContact(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditSiteContact)
