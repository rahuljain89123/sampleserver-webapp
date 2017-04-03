
import React from 'react'
import { connect } from 'react-redux'
import filestack from 'filestack-js'

import { editUser, clearEditingUserError, fetchUser } from '../../actions/users'
import { currentUser, safeGet } from '../../normalizers'


const FILESTACK_API_KEY = 'ATg3pguKNRI2jg6wRHiydz'
const FILESTACK_OPTIONS = {
    accept: 'image/*',
    fromSources: ['local_file_system', 'dropbox'],
    maxFiles: 1,
    transformOptions: { maxDimensions: [400, 400] },
}


class UpdateProfileImage extends React.Component {
    constructor (props) {
        super(props)

        this.client = filestack.init(FILESTACK_API_KEY)
        this.state = {
            name: safeGet(this.props.user, 'name', ''),
            photoURL: safeGet(this.props.user, 'photo_url', ''),
        }
    }

    pickImage () {
        this.client
            .pick(FILESTACK_OPTIONS)
            .then(res => this.onUpload(res))
    }

    onUpload (res) {
        res.filesUploaded.map(file =>
            this.props.editUser(this.props.user.get('id'), {
                'photo_url': file.url,
            }))
    }

    render () {
        return (
            <div className="update-profile-image">
                <div className="profile-image-holder" onClick={() => this.pickImage()} >
                    { this.state.photoURL ? (
                        <img className="profile-image" src={this.state.photoURL} alt={this.state.name} />
                    ) : (
                        <img className="profile-image" src="/static/img/blank-avatar.png" alt={this.state.name} />
                    )}
                    <div className="edit-panel">Edit</div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = store => ({
    user: currentUser(store),
    editingUserError: store.get('editingUserError'),
    editingUser: store.get('editingUser'),
})

const mapDispatchToProps = dispatch => ({
    editUser: (id, user) => dispatch(editUser(id, user)),
    clearEditingUserError: () => dispatch(clearEditingUserError()),
    fetchUser: id => dispatch(fetchUser(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfileImage)
