import React from 'react'


class SiteMapImage extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.drawWells()
  }

  componentDidUpdate () {
    this.drawWells()
  }

  drawWells () {
    const ctx = this.canvasEl.getContext('2d')
    ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height)


    this.props.siteMapWells.forEach((well) => { this.drawWellMarker(well, ctx) })

    if (this.props.addingSiteMapWell) {

      this.drawWellMarker(this.props.addingSiteMapWell, ctx, 'white')
    }
  }

  drawWellMarker (well, ctx, color='black') {
    const x = well.get('xpos'),
          y = well.get('ypos'),
          r = 10

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
  }

  render () {
    const { imageUrl, addSiteMapWell } = this.props
    return (
      <div className='img-and-canvas-overlay'>
        <img src={imageUrl} />

        <canvas
          height='640'
          width='640'
          ref={(canvas) => {this.canvasEl = canvas}}
          onClick={addSiteMapWell} />
      </div>
    )
  }
}

export default SiteMapImage
