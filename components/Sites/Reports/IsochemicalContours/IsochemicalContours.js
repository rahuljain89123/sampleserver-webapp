import React from 'react'
import { connect } from 'react-redux'
import { Field, FieldArray, reduxForm, formValueSelector, change } from 'redux-form/immutable'
import { Form, Input, Label } from 'reactstrap'
import moment from 'moment'

import SelectFormGroup from 'SharedComponents/ReduxFormHelpers/SelectFormGroup'
import IndividualFormGroup from 'SharedComponents/ReduxFormHelpers/IndividualFormGroup'
import SiteMapRenderer from 'SharedComponents/SiteMapRenderer'
import SelectSubstances from 'Sites/Reports/Shared/SelectSubstances'

import {
  fetchSiteMap,
  fetchSiteMaps,
  fetchSiteMapWells,
  createSiteMapWell,
  setAddingSiteMapWell,
  deleteSiteMapWell,
} from 'actions/siteMaps'

import {
  fetchWells
} from 'actions/wells'

import {
  fetchSubstances,
  fetchSubstanceGroups,
} from 'actions/substances'
import { fetchSamples } from 'actions/samples'
import {
  fetchGroupedSampleValues,
  fetchSampleDates,
} from 'actions/sampleValues'

import {
  flashMessage
} from 'actions/global'

class IsochemicalContours extends React.Component {
  constructor (props) {
    super(props)
    this.drawWellMarker = this.drawWellMarker.bind(this)
    this.processClickEvent = this.processClickEvent.bind(this)
  }

  componentDidMount () {
    this.props.fetchSiteMaps({ site_id: this.props.site.get('id') })
    this.props.fetchSubstances()
    this.props.fetchSubstanceGroups()
    this.props.fetchWells({ site_id: this.props.site.get('id') })
    this.props.fetchSamples({ site_id: this.props.site.get('id') })
    this.props.fetchSampleDates(this.props.site.get('id'))
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.siteMapId && nextProps.siteMapId !== this.props.siteMapId) {
      this.props.fetchSiteMapWells({sitemap_id: nextProps.siteMapId })
    }

    if (nextProps.substanceIds
      && !nextProps.substanceIds.equals(this.props.substanceIds)
      && nextProps.siteMapId
      && nextProps.date) {
      this.props.fetchGroupedSampleValues({
        date: nextProps.date,
        sitemap_id: nextProps.siteMapId,
        substance_ids: nextProps.substanceIds,
        site_id: nextProps.site.get('id')
      })
    }
  }

  processClickEvent (xpos, ypos, evt) {
    // console.log(evt.region)
  }

  substanceIdInDate (substanceId) {
    const { date: t_date, sampleDates } = this.props
    if (!t_date) { return false; }
    const selectedDate = moment(t_date)

    let isPresent = false

    sampleDates.forEach((date) => {
      const d = moment(date.get('date_collected'))
      if (d.isSame(selectedDate) &&
          date.get('substance_ids').includes(substanceId)) {
        isPresent = true
      }

    })

    return isPresent

    return true
  }

  drawWellMarker (well, ctx, loc) {
    const { x, y, scale } = loc

    const val = this.props.date ? 100.0 : this.props.wells.get(well.get('well_id')).get('title');
    const color = 'black'
    const fontSize = 15 * scale
    const width = 100 * scale
    const height = 25 * scale
    // const .
    ctx.fillStyle = color
    ctx.globalAlpha = 0.8
    ctx.beginPath()
    ctx.fillRect(x-width/2, y-height/2, width, height)
    ctx.globalAlpha = 1.0

    ctx.font = `bold ${fontSize}px Arial`
    ctx.fillStyle = 'white'
    ctx.textAlign = 'center'
    ctx.textBaseline='middle'

    ctx.fillText(val, x, y)

    // ctx.addHitRegion({ id: well.get('id') })
    ctx.closePath()
  }

  render () {

    const siteMapOptions = this.props.siteMaps.valueSeq().map((siteMap) =>
      <option key={siteMap.get('id')} value={siteMap.get('id')}>{siteMap.get('title')}</option>
    )

    const dateOptions = this.props.sampleDates.valueSeq().map((date, i) =>
      <option key={date.get('id')}>{date.get('date_collected')}</option>)

    const groupedSubstances = this.props.substanceGroups.map((substanceGroup) =>
      this.props.substances.filter((substance) => (substance.get('substance_group_id') === substanceGroup.get('id')))
    )

    const substanceOptions = groupedSubstances.map((substances, substanceGroupId) =>
      <optgroup key={substanceGroupId} label={this.props.substanceGroups.get(substanceGroupId).get('title')}>
        {this.props.substances.valueSeq().map(substance => {
          if (!this.substanceIdInDate(substance.get('id'))) { return null }
          return (<option key={substance.get('id')} value={substance.get('id')}>{substance.get('title')}</option>)
        })}
      </optgroup>
    ).filter((substanceGroup) => substanceGroup.props.children.size).valueSeq()

    const booleanOptions = [
      { value: 'true', title: 'ON' },
      { value: 'false', title: 'OFF' }
    ].map((bool, index) => <option key={index} value={bool.value}>{bool.title}</option>)

    const scaleOptions = ['Linear', 'Logarithmic'].map((opt, index) =>
      <option key={index} value={opt}>{opt}</option>
    )

    let siteMapComponent = null

    if (this.props.siteMapId) {
      const currentSiteMap = this.props.siteMaps.get(
        parseInt(this.props.siteMapId)
      )

      const siteMapWells = this.props.siteMapWells.filter((smw) => smw.get('site_map_id') === parseInt(this.props.siteMapId))
      siteMapComponent = <SiteMapRenderer
        imageUrl={currentSiteMap.get('url')}
        wells={siteMapWells}
        onClick={this.processClickEvent}
        drawWellMarker={this.drawWellMarker}
        />
    }

    return (<div>
      <Form>
        <Field
          props={{label: 'Sitemap'}}
          name='sitemap_id'
          id='sitemap_id'
          component={SelectFormGroup}
          options={siteMapOptions}
        />

        <Field
          props={{label: 'Date'}}
          name='date'
          id='date'
          options={dateOptions}
          component={SelectFormGroup}
        />

        <FieldArray
          name='substance_ids'
          id='substance_ids'
          component={SelectSubstances}
          options={substanceOptions}
          substances={this.props.substances}
        />

        <Field
          props={{label: 'Zero Line'}}
          name='zero_line'
          id='zero_line'
          options={booleanOptions}
          component={SelectFormGroup}
        />

        <Field
          props={{label: 'Heatmap'}}
          name='heatmap'
          id='heatmap'
          options={booleanOptions}
          component={SelectFormGroup}
        />

        <Field
          props={{label: 'Scale'}}
          name='scale'
          id='scale'
          options={scaleOptions}
          component={SelectFormGroup}
        />

        <Field
          props={{label: 'Title'}}
          name='title'
          id='title'
          type='text'
          component={IndividualFormGroup}
        />
      </Form>

      {siteMapComponent}
    </div>)
  }
}

IsochemicalContours = reduxForm({ form: 'IsochemicalContoursForm' })(IsochemicalContours)

const selector = formValueSelector('IsochemicalContoursForm')

const mapStateToProps = (state, props) => ({
  siteMaps: state.get('siteMaps'),
  siteMapWells: state.get('siteMapWells'),
  substances: state.get('substances'),
  substanceGroups: state.get('substanceGroups'),
  wells: state.get('wells'),
  samples: state.get('samples'),
  sampleDates: state.get('sampleDates'),
  groupedSampleValues: state.get('groupedSampleValues'),
  siteMapId: selector(state, 'sitemap_id'),
  substanceIds: selector(state, 'substance_ids'),
  date: selector(state, 'date'),
})

const mapDispatchToProps = dispatch => ({
  flashMessage: (type, message) => dispatch(flashMessage(type, heading)),

  fetchSiteMaps: (filters) => dispatch(fetchSiteMaps(filters)),
  fetchSiteMap: (id) => dispatch(fetchSiteMap(id)),
  fetchSamples: filters => dispatch(fetchSamples(filters)),
  fetchGroupedSampleValues: params => dispatch(fetchGroupedSampleValues(params)),
  fetchSampleDates: siteId => dispatch(fetchSampleDates(siteId)),
  fetchSiteMapWells: (filters) => dispatch(fetchSiteMapWells(filters)),
  fetchSubstances: (filters) => dispatch(fetchSubstances(filters)),
  fetchSubstanceGroups: () => dispatch(fetchSubstanceGroups()),

  fetchWells: (filters) => dispatch(fetchWells(filters)),
})

export default connect(mapStateToProps, mapDispatchToProps)(IsochemicalContours)
