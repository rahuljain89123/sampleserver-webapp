
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
            loadedUser: !!this.props.user,
            userId: safeGet(this.props.user, 'id', ''),
            email: safeGet(this.props.user, 'email', ''),
            name: safeGet(this.props.user, 'name', ''),
            phone: safeGet(this.props.user, 'phone', ''),
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
            this.props.editUser(this.props.userId, {
                'photo_url': file.url,
            }).then(id => {
                this.props.fetchUser(id)
            }))
    }

    componentWillMount () {
    }

    componentWillReceiveProps (nextProps) {
        if (!this.state.loadedUser) {
            this.setState({
                loadedUser: !!nextProps.user,
                userId: safeGet(nextProps.user, 'id', ''),
                email: safeGet(nextProps.user, 'email', ''),
                name: safeGet(nextProps.user, 'name', ''),
                phone: safeGet(nextProps.user, 'phone', ''),
                photoURL: safeGet(nextProps.user, 'photo_url', ''),
            })
        }
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
