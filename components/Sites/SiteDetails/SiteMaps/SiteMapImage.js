import React from 'react'

const CANVAS_HEIGHT = '600'
const CANVAS_WIDTH = '800'

class SiteMapImage extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      img: undefined,
      centerVals: {
        x: null,
        y: null,
      },

      x: 0,
      y: 0,

      drag: null,

      scale: 1,
    }

    this.setImage = this.setImage.bind(this)
    this.drawCanvas = this.drawCanvas.bind(this)
    this.addSiteMapWell = this.addSiteMapWell.bind(this)
    this.initDrag = this.initDrag.bind(this)
    this.processDrag = this.processDrag.bind(this)
    this.endDrag = this.endDrag.bind(this)

    this.componentDidUpdate = this.drawCanvas
  }

  /**
   * Loads the SiteMapImage from source and creates an ImageBitmap from it.
   */
  componentDidMount () {
    const img = new Image()
    const setImage = this.setImage

    img.onload = function() {
      createImageBitmap(this).then(setImage)
    }

    img.src = this.props.imageUrl
  }

  /**
   * Takes a loaded img element and stores it into an ImageBitmap, and
   * updates the state with the appropriate x and y coordinate so that the image
   * is centered in the canvas element.
   */
  setImage(img) {
    this.setState({
      img,
      centerVals: {
        x: this.centerVal(img.width, CANVAS_WIDTH),
        y: this.centerVal(img.height, CANVAS_HEIGHT),
      },
      scale: 1,
    })
  }

  /**
   * @param imgDim {Integer} length of image
   * @param canvasDim {Integer} total length of canvas
   * @return the x or y coordinate such that the image will be centered within the canvas
   */
  centerVal (imgDim, canvasDim, scale = 1) {
    return (canvasDim - imgDim * scale) / 2;
  }

  addSiteMapWell (evt) {
    const {
      x,
      y,
      img,
      scale,
      centerVals: {
        x: centerX,
        y: centerY
      }
    } = this.state
    const divOffsets = evt.target.getBoundingClientRect()

    const clickX = evt.clientX - divOffsets.left,
          clickY = evt.clientY - divOffsets.top,
          imgX   = x + centerX,
          imgY   = y + centerY,
          xpos   = (clickX - imgX)/scale,
          ypos   = (clickY - imgY)/scale


    // Check that click is within the bounds of the map
    if ( clickX < imgX ||
          clickX > (imgX + img.width * scale) ||
          clickY < imgY ||
          clickY > (imgY + img.height * scale)) {
      return
    }

    this.props.addSiteMapWell(xpos, ypos)
  }

  scaleBy (increment) {
    if (this.state.scale + increment < 0.2) { return } //don't decrement scale below 0
    this.setState((prevState) => {
      const newScale = prevState.scale + increment
      return {
        scale: newScale,
        centerVals: {
          x: this.centerVal(prevState.img.width, CANVAS_WIDTH, newScale),
          y: this.centerVal(prevState.img.height, CANVAS_HEIGHT, newScale),
        }
      }
    })
  }

  /**
   * Begins the dragging event so the image can be moved around in the container
   * Stores start position of the image and start position of the mouse in state.drag
   */
  initDrag (evt) {
    const { screenX, screenY, button } = evt
    const { x, y } = this.state

    // Don't do anything if it's not a left click
    if (button !== 0) { return }

    this.setState({
      drag: {
        startX: screenX,
        startY: screenY,
        posStartX: x,
        posStartY: y,
      }
    })
  }

  /**
   * Moves the image as it is being dragged in the container
   */
  processDrag (evt) {
    const { screenX, screenY } = evt
    if (!this.state.drag) { return } // Return if not dragging

    this.setState({
      x: (screenX - this.state.drag.startX) + this.state.drag.posStartX,
      y: (screenY - this.state.drag.startY) + this.state.drag.posStartY,
    })
  }

  endDrag (evt) {
    const { screenX, screenY } = evt
    const drag = null
    // Don't do anything if it's not a drag
    if (!this.state.drag) { return }

    // If they moved the mouse less than 10 pixels, fire a click event, clear the drag
    if (Math.abs(this.state.drag.startX - screenX) < 10) {
      this.addSiteMapWell(evt)
      this.setState({ drag })
    } else {
      // Otherwise drag the image
      const newPosX = (screenX - this.state.drag.startX) + this.state.drag.posStartX
      const newPosY = (screenY - this.state.drag.startY) + this.state.drag.posStartY

      this.setState({
        drag,
        x: newPosX,
        y: newPosY
      })
    }

  }

  drawCanvas () {
    const ctx = this.canvasEl.getContext('2d')
    const { x, y, scale, img, centerVals: { x: centerX, y: centerY } } = this.state
    if (!img) { return } // break if the image hasn't been loaded yet.

    ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height)

    ctx.drawImage(img, centerX + x, centerY + y, img.width * scale, img.height * scale)
    this.drawWells(ctx)
  }

  drawWells (ctx) {
    this.props.siteMapWells.forEach((well) => { this.drawWellMarker(well, ctx) })

    if (this.props.addingSiteMapWell) {
      this.drawWellMarker(this.props.addingSiteMapWell, ctx, 'red')
    }

  }

  drawWellMarker (well, ctx, color='black') {
    const { x: imgX, y: imgY, scale, centerVals: { x: centerX, y: centerY } } = this.state
    const x = well.get('xpos') * scale + (centerX + imgX),
          y = well.get('ypos') * scale + (centerY + imgY),
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
    const { addSiteMapWell, props: { imageUrl } } = this

    const overlayStyles = {
      width: `${CANVAS_WIDTH}px`,
      height: `${CANVAS_HEIGHT}px`,
    }

    return (
      <div className='site-map-image'>
        <a href='#' onClick={(e) => this.scaleBy(0.2)}>Zoom In</a>
        <a href='#' onClick={(e) => this.scaleBy(-0.2)}>Zoom Out</a>
        <div className='img-and-canvas-overlay' style={overlayStyles}>

          <canvas
            height={CANVAS_HEIGHT}
            width={CANVAS_WIDTH}
            ref={(canvas) => {this.canvasEl = canvas}}
            onMouseDown={this.initDrag}
            onMouseMove={this.processDrag}
            onMouseUp={this.endDrag} />

        </div>
      </div>
    )
  }
}

export default SiteMapImage
