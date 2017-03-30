
import React from 'react'

const SiteInfo = props => (
    <div>
        <strong>Title: </strong><span>{props.site.get('title')}</span><br />
        <strong>Contact: </strong><span>{props.site.get('contact')}</span><br />
        <strong>Contact phone: </strong><span>{props.site.get('contact_phone')}</span><br />
        <strong>Contact email: </strong><span>{props.site.get('contact_email')}</span><br />
        <strong>Notes: </strong><span>{props.site.get('notes')}</span><br />
        <strong>Address: </strong><span>{props.site.get('address')}</span><br />
        <strong>City: </strong><span>{props.site.get('city')}</span><br />
        <strong>State: </strong><span>{props.site.get('state')}</span><br />
        <strong>Zip: </strong><span>{props.site.get('zip')}</span><br />
        <strong>County: </strong><span>{props.site.get('county')}</span><br />
        <strong>Latitude: </strong><span>{props.site.get('latitude')}</span><br />
        <strong>Longitude: </strong><span>{props.site.get('longitude')}</span><br />
        <strong>Start sampling on: </strong><span>{props.site.get('start_sampling_on')}</span><br />
        <strong>History: </strong><span dangerouslySetInnerHTML={{ __html: props.site.get('history') }} /><br />
        <strong>Background: </strong><span dangerouslySetInnerHTML={{ __html: props.site.get('background') }} /><br />
        <strong>Summary: </strong><span dangerouslySetInnerHTML={{ __html: props.site.get('summary') }} /><br />
    </div>
)

export default SiteInfo
