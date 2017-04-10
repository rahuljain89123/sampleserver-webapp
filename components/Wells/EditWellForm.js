
import React from 'react'
import { connect } from 'react-redux'
import {
    Button,
    Form,
    FormGroup,
    FormFeedback,
    Label,
    Input,
} from 'reactstrap'

import { editWell, clearEditingWellError } from '../../actions/wells'
import { msgFromError } from '../../util'

class EditWellForm extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            title: this.props.well.get('title'),
            top_of_casing: this.props.well.get('top_of_casing'),
            diameter: this.props.well.get('diameter'),
            material: this.props.well.get('material'),
            screenlength: this.props.well.get('screenlength'),
            sampletechnique: this.props.well.get('sampletechnique'),
            latitude: this.props.well.get('latitude'),
            longitude: this.props.well.get('longitude'),
            est_depth_to_water: this.props.well.get('est_depth_to_water'),
            depth_to_bottom: this.props.well.get('depth_to_bottom'),
            purge_water_disposal: this.props.well.get('purge_water_disposal'),
            notes: this.props.well.get('notes'),
        }
    }

    componentWillMount () {
        if (this.props.editingWellError) {
            this.props.clearEditingWellError()
        }
    }

    onChange (e) {
        if (this.props.editingWellError) {
            this.props.clearEditingWellError()
        }

        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    onSubmit (e) {
        e.preventDefault()
        this.props.editWell(this.props.well.get('id'), {
            title: this.state.title,
            top_of_casing: this.state.top_of_casing,
            diameter: this.state.diameter,
            material: this.state.material,
            screenlength: this.state.screenlength,
            sampletechnique: this.state.sampletechnique,
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            est_depth_to_water: this.state.est_depth_to_water,
            depth_to_bottom: this.state.depth_to_bottom,
            purge_water_disposal: this.state.purge_water_disposal,
            notes: this.state.notes,
        })
        .then(this.props.onSuccess)
    }

    render () {
        const error = this.props.editingWellError
        const generalError = error && error.msg ? error.msg : null
        const errors = error && error.key ? {
            [error.key]: msgFromError(error),
        } : {}

        return (
            <Form onSubmit={e => this.onSubmit(e)}>
                <FormGroup color={errors.title ? 'danger' : ''}>
                    <Label for="title">Well/Sample ID</Label>
                    <Input
                        state={errors.title ? 'danger' : ''}
                        name="title"
                        id="title"
                        value={this.state.title}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{errors.title}</FormFeedback>
                </FormGroup>
                <FormGroup color={errors.top_of_casing ? 'danger' : ''}>
                    <Label for="title">Top of Casing Elevation</Label>
                    <Input
                        state={errors.top_of_casing ? 'danger' : ''}
                        name="top_of_casing"
                        id="top_of_casing"
                        value={this.state.top_of_casing}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{errors.top_of_casing}</FormFeedback>
                </FormGroup>
                <FormGroup color={errors.diameter ? 'danger' : ''}>
                    <Label for="title">Well Diameter (inches)</Label>
                    <Input
                        state={errors.diameter ? 'danger' : ''}
                        name="diameter"
                        id="diameter"
                        value={this.state.diameter}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{errors.diameter}</FormFeedback>
                </FormGroup>
                <FormGroup color={errors.material ? 'danger' : ''}>
                    <Label for="title">Well Material</Label>
                    <Input
                        state={errors.material ? 'danger' : ''}
                        name="material"
                        id="material"
                        value={this.state.material}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{errors.material}</FormFeedback>
                </FormGroup>
                <FormGroup color={errors.screenlength ? 'danger' : ''}>
                    <Label for="title">Screen Length (ft)</Label>
                    <Input
                        state={errors.screenlength ? 'danger' : ''}
                        name="screenlength"
                        id="screenlength"
                        value={this.state.screenlength}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{errors.screenlength}</FormFeedback>
                </FormGroup>
                <FormGroup color={errors.sampletechnique ? 'danger' : ''}>
                    <Label for="title">Sampling Technique</Label>
                    <Input
                        state={errors.sampletechnique ? 'danger' : ''}
                        name="sampletechnique"
                        id="sampletechnique"
                        value={this.state.sampletechnique}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{errors.sampletechnique}</FormFeedback>
                </FormGroup>
                <FormGroup color={errors.latitude ? 'danger' : ''}>
                    <Label for="title">GPS Latitude (decimal)</Label>
                    <Input
                        state={errors.latitude ? 'danger' : ''}
                        name="latitude"
                        id="latitude"
                        value={this.state.latitude}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{errors.latitude}</FormFeedback>
                </FormGroup>
                <FormGroup color={errors.longitude ? 'danger' : ''}>
                    <Label for="title">GPS Longitude (decimal)</Label>
                    <Input
                        state={errors.longitude ? 'danger' : ''}
                        name="longitude"
                        id="longitude"
                        value={this.state.longitude}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{errors.longitude}</FormFeedback>
                </FormGroup>
                <FormGroup color={errors.est_depth_to_water ? 'danger' : ''}>
                    <Label for="title">Predicted Depth to Water (ft)</Label>
                    <Input
                        state={errors.est_depth_to_water ? 'danger' : ''}
                        name="est_depth_to_water"
                        id="est_depth_to_water"
                        value={this.state.est_depth_to_water}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{errors.est_depth_to_water}</FormFeedback>
                </FormGroup>
                <FormGroup color={errors.depth_to_bottom ? 'danger' : ''}>
                    <Label for="title">Measured Depth to Bottom (ft)</Label>
                    <Input
                        state={errors.depth_to_bottom ? 'danger' : ''}
                        name="depth_to_bottom"
                        id="depth_to_bottom"
                        value={this.state.depth_to_bottom}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{errors.depth_to_bottom}</FormFeedback>
                </FormGroup>
                <FormGroup color={errors.purge_water_disposal ? 'danger' : ''}>
                    <Label for="title">Well Sampling Purge Water Disposal</Label>
                    <Input
                        state={errors.purge_water_disposal ? 'danger' : ''}
                        name="purge_water_disposal"
                        id="purge_water_disposal"
                        value={this.state.purge_water_disposal}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{errors.purge_water_disposal}</FormFeedback>
                </FormGroup>
                <FormGroup color={errors.notes ? 'danger' : ''}>
                    <Label for="title">Well Notes</Label>
                    <Input
                        state={errors.notes ? 'danger' : ''}
                        name="notes"
                        id="notes"
                        value={this.state.notes}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{errors.notes}</FormFeedback>
                </FormGroup>
                <Button
                    role="button"
                    color="primary"
                    disabled={this.props.editingWell}
                >Save</Button>
            </Form>
        )
    }
}

const mapStateToProps = store => ({
    editingWellError: store.get('editingWellError'),
    editingWell: store.get('editingWell'),
})

const mapDispatchToProps = dispatch => ({
    editWell: (id, well) => dispatch(editWell(id, well)),
    clearEditingWellError: () => dispatch(clearEditingWellError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditWellForm)
