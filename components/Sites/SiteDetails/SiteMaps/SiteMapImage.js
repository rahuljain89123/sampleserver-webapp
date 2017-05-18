import React from 'react'

import SiteMapRenderer from 'SharedComponents/SiteMapRenderer'
const CANVAS_HEIGHT = '600'
const CANVAS_WIDTH = '800'

class SiteMapImage extends React.Component {
  constructor (props) {
    super(props)

    this.drawWellMarker = this.drawWellMarker.bind(this)
  }


  drawWellMarker (well, ctx, loc) {
    const { x, y, scale } = loc
    const r = 7 * scale,
          fontSize = 12 * scale,
          color = well.get('well_id') ? 'black' : 'red'
    // Draw top left of marker and fill it
    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(x - r, y)
    ctx.lineTo(x, y)
    ctx.lineTo(x, y-r)
    ctx.arc(x, y, r, 3*Math.PI/2, Math.PI, true)
    ctx.stroke()
    ctx.closePath()
    ctx.fill()

    // Draw bottom right of marker and fill it
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x, y)
    ctx.lineTo(x, y+r)
    ctx.arc(x, y, r, Math.PI/2, 0, true)
    ctx.stroke()
    ctx.closePath()
    ctx.fill()

    // Draw remainder of the circle
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2 * Math.PI, false)
    ctx.stroke()
    ctx.closePath()

    if(well.get('well_id')) {
      ctx.font = `${fontSize}px Arial`
      const wellTitle = this.props.wells.get(well.get('well_id')).get('title')
      ctx.fillText(wellTitle, x + r, y - r)
    }
  }



  render () {
    const {
      drawWellMarker,
      props: { imageUrl, addSiteMapWell, siteMapWells, addingSiteMapWell }
    } = this


    const allWells = addingSiteMapWell ? siteMapWells.set('adding', addingSiteMapWell).valueSeq() : siteMapWells.valueSeq()

    return (
      <SiteMapRenderer
        imageUrl={imageUrl}
        height='600px'
        width='800px'
        wells={allWells}
        onClick={addSiteMapWell}
        drawWellMarker={drawWellMarker} />
    )
  }
}

export default SiteMapImage
