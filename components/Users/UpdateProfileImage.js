
import React from 'react'
import { connect } from 'react-redux'
import filestack from 'filestack-js'

import { editUser, clearEditingUserError } from '../../actions/users'
import { currentUser, safeGet } from '../../normalizers'
import { msgFromError } from '../../util'


const FILESTACK_API_KEY = 'ATg3pguKNRI2jg6wRHiydz'
const FILESTACK_OPTIONS = {
    accept: 'image/*',
    fromSources: ['local_file_system', 'dropbox'],
    maxFiles: 1,
    transformOptions: { maxDimensions: [500, 500] },
}


class UpdateProfileImage extends React.Component {
    constructor (props) {
        super(props)

        this.client = filestack.init(FILESTACK_API_KEY)
    }

    pickImage () {
        this.client
            .pick(FILESTACK_OPTIONS)
            .then(res => this.onUpload(res))
    }

    onUpload (res) {
        res.filesUploaded.map(file => {
            console.log(file)
            return this.props.editUser(this.props.userId, {
                'photo_url': file.url,
            })
        })
    }

    componentWillMount () {
    }

    componentWillReceiveProps (nextProps) {
    }

    render () {
        return (
            <div className="update-profile-image">
                { this.props.photoURL ? (
                    <img className="profile-image" src={this.props.photoURL} alt={this.props.name} onClick={() => this.pickImage()} />
                ) : (
                    <img className="profile-image" src="/static/img/blank-avatar.png" alt={this.props.name} onClick={() => this.pickImage()} />
                )}
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
})

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfileImage)
